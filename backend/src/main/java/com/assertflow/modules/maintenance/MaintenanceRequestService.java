package com.assertflow.modules.maintenance;

import com.assertflow.modules.assets.Asset;
import com.assertflow.modules.assets.AssetRepository;
import com.assertflow.modules.assets.AssetStatus;
import com.assertflow.modules.auth.User;
import com.assertflow.modules.auth.UserRepository;
import com.assertflow.modules.maintenance.dto.MaintenanceRequestRequest;
import com.assertflow.modules.maintenance.dto.MaintenanceRequestResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MaintenanceRequestService {

    @Autowired
    private MaintenanceRequestRepository mrRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public MaintenanceRequestResponse createRequest(MaintenanceRequestRequest request) {
        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new IllegalArgumentException("Asset not found."));

        User reporter = userRepository.findById(request.getReporterId())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        MaintenanceRequest mr = MaintenanceRequest.builder()
                .asset(asset)
                .reporter(reporter)
                .description(request.getDescription())
                .reportedDate(LocalDate.now())
                .priority(request.getPriority())
                .status(MaintenanceStatus.PENDING)
                .cost(request.getCost())
                .build();

        mr = mrRepository.save(mr);
        return mapToResponse(mr);
    }

    @Transactional
    public MaintenanceRequestResponse updateStatus(UUID requestId, String statusStr, String notes) {
        MaintenanceRequest mr = mrRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Maintenance request not found."));

        MaintenanceStatus newStatus = MaintenanceStatus.valueOf(statusStr.toUpperCase());
        mr.setStatus(newStatus);
        if (notes != null && !notes.isBlank()) {
            mr.setResolutionNotes(notes);
        }

        Asset asset = mr.getAsset();

        // Implement logic state machine flips
        if (newStatus == MaintenanceStatus.APPROVED || newStatus == MaintenanceStatus.IN_PROGRESS) {
            asset.setStatus(AssetStatus.UNDER_MAINTENANCE);
            assetRepository.save(asset);
        } else if (newStatus == MaintenanceStatus.RESOLVED || newStatus == MaintenanceStatus.CANCELLED) {
            if (asset.getStatus() == AssetStatus.UNDER_MAINTENANCE) {
                asset.setStatus(AssetStatus.AVAILABLE);
                assetRepository.save(asset);
            }
        }

        mr = mrRepository.save(mr);
        return mapToResponse(mr);
    }

    @Transactional(readOnly = true)
    public List<MaintenanceRequestResponse> getAllRequests() {
        return mrRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MaintenanceRequestResponse> getAssetRequests(UUID assetId) {
        return mrRepository.findByAssetId(assetId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private MaintenanceRequestResponse mapToResponse(MaintenanceRequest mr) {
        return MaintenanceRequestResponse.builder()
                .id(mr.getId())
                .assetId(mr.getAsset().getId())
                .assetName(mr.getAsset().getName())
                .assetTag(mr.getAsset().getTag())
                .reporterId(mr.getReporter().getId())
                .reporterEmail(mr.getReporter().getEmail())
                .description(mr.getDescription())
                .reportedDate(mr.getReportedDate())
                .priority(mr.getPriority())
                .status(mr.getStatus())
                .resolutionNotes(mr.getResolutionNotes())
                .cost(mr.getCost())
                .build();
    }
}
