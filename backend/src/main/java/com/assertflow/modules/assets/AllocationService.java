package com.assertflow.modules.assets;

import com.assertflow.modules.assets.dto.AllocationRequest;
import com.assertflow.modules.assets.dto.AllocationResponse;
import com.assertflow.modules.auth.User;
import com.assertflow.modules.auth.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AllocationService {

    @Autowired
    private AllocationRepository allocationRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public synchronized AllocationResponse allocateAsset(AllocationRequest request) {
        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new IllegalArgumentException("Asset not found."));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        // Double-Allocation Check
        if (asset.getStatus() != AssetStatus.AVAILABLE) {
            throw new IllegalArgumentException(
                    "Asset is not available for allocation. Current status: " + asset.getStatus());
        }

        LocalDate allocDate = request.getAllocatedDate() != null ? request.getAllocatedDate() : LocalDate.now();

        Allocation allocation = Allocation.builder()
                .asset(asset)
                .user(user)
                .allocatedDate(allocDate)
                .dueDate(request.getDueDate())
                .status(AllocationStatus.ACTIVE)
                .notes(request.getNotes())
                .build();

        // Update asset status
        asset.setStatus(AssetStatus.ALLOCATED);
        assetRepository.save(asset);

        allocation = allocationRepository.save(allocation);
        return mapToResponse(allocation);
    }

    @Transactional
    public synchronized AllocationResponse returnAsset(UUID allocationId, String returnNotes) {
        Allocation allocation = allocationRepository.findById(allocationId)
                .orElseThrow(() -> new IllegalArgumentException("Allocation record not found."));

        if (allocation.getStatus() == AllocationStatus.RETURNED) {
            throw new IllegalArgumentException("Asset has already been returned.");
        }

        allocation.setReturnedDate(LocalDate.now());
        allocation.setStatus(AllocationStatus.RETURNED);
        if (returnNotes != null && !returnNotes.isBlank()) {
            allocation.setNotes(allocation.getNotes() == null ? returnNotes
                    : allocation.getNotes() + " | Return Notes: " + returnNotes);
        }

        Asset asset = allocation.getAsset();
        asset.setStatus(AssetStatus.AVAILABLE);
        assetRepository.save(asset);

        allocation = allocationRepository.save(allocation);
        return mapToResponse(allocation);
    }

    @Transactional(readOnly = true)
    public List<AllocationResponse> getAllAllocations() {
        return allocationRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AllocationResponse> getUserAllocations(UUID userId) {
        return allocationRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private AllocationResponse mapToResponse(Allocation allocation) {
        return AllocationResponse.builder()
                .id(allocation.getId())
                .assetId(allocation.getAsset().getId())
                .assetTag(allocation.getAsset().getTag())
                .assetName(allocation.getAsset().getName())
                .userId(allocation.getUser().getId())
                .userEmail(allocation.getUser().getEmail())
                .allocatedDate(allocation.getAllocatedDate())
                .dueDate(allocation.getDueDate())
                .returnedDate(allocation.getReturnedDate())
                .notes(allocation.getNotes())
                .status(allocation.getStatus())
                .build();
    }
}
