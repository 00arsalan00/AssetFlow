package com.assertflow.modules.audit;

import com.assertflow.modules.assets.Asset;
import com.assertflow.modules.assets.AssetRepository;
import com.assertflow.modules.assets.AssetStatus;
import com.assertflow.modules.auth.User;
import com.assertflow.modules.auth.UserRepository;
import com.assertflow.modules.audit.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuditService {

    @Autowired
    private AuditCycleRepository cycleRepository;

    @Autowired
    private AuditItemRepository itemRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public AuditCycleResponse createAuditCycle(AuditCycleRequest request) {
        AuditCycle cycle = AuditCycle.builder()
                .name(request.getName())
                .description(request.getDescription())
                .startDate(LocalDate.now())
                .createdDate(LocalDate.now())
                .status(AuditCycleStatus.ACTIVE)
                .build();

        cycle = cycleRepository.save(cycle);

        // Seeding mechanism: create a pending check for EVERY asset currently
        // registered
        List<Asset> assets = assetRepository.findAll();
        for (Asset asset : assets) {
            AuditItem item = AuditItem.builder()
                    .auditCycle(cycle)
                    .asset(asset)
                    .status(AuditItemStatus.PENDING)
                    .build();
            itemRepository.save(item);
        }

        return mapToCycleResponse(cycle);
    }

    @Transactional
    public AuditItemResponse verifyAuditItem(UUID itemId, AuditItemVerificationRequest request) {
        AuditItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Audit item not found."));

        if (item.getAuditCycle().getStatus() != AuditCycleStatus.ACTIVE) {
            throw new IllegalArgumentException("Cannot audit items for a closed or cancelled audit cycle.");
        }

        User auditor = userRepository.findById(request.getAuditorId())
                .orElseThrow(() -> new IllegalArgumentException("Auditor not found."));

        item.setAuditor(auditor);
        item.setAuditDate(LocalDateTime.now());
        item.setStatus(request.getStatus());
        item.setNotes(request.getNotes());

        // Perform inventory status automation updates
        Asset asset = item.getAsset();
        if (request.getStatus() == AuditItemStatus.DAMAGED) {
            asset.setCondition("DAMAGED");
            asset.setStatus(AssetStatus.UNDER_MAINTENANCE);
            assetRepository.save(asset);
        }

        item = itemRepository.save(item);
        return mapToItemResponse(item);
    }

    @Transactional
    public AuditCycleResponse completeAuditCycle(UUID cycleId) {
        AuditCycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new IllegalArgumentException("Audit cycle not found."));

        cycle.setStatus(AuditCycleStatus.COMPLETED);
        cycle.setEndDate(LocalDate.now());
        cycle = cycleRepository.save(cycle);
        return mapToCycleResponse(cycle);
    }

    @Transactional(readOnly = true)
    public List<AuditCycleResponse> getAllAuditCycles() {
        return cycleRepository.findAll().stream()
                .map(this::mapToCycleResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AuditItemResponse> getCycleItems(UUID cycleId) {
        return itemRepository.findByAuditCycleId(cycleId).stream()
                .map(this::mapToItemResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AuditSummaryResponse getAuditSummary(UUID cycleId) {
        AuditCycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new IllegalArgumentException("Audit cycle not found."));

        List<AuditItem> items = itemRepository.findByAuditCycleId(cycleId);

        long total = items.size();
        long pending = items.stream().filter(i -> i.getStatus() == AuditItemStatus.PENDING).count();
        long verified = items.stream().filter(i -> i.getStatus() == AuditItemStatus.VERIFIED).count();
        long missing = items.stream().filter(i -> i.getStatus() == AuditItemStatus.MISSING).count();
        long damaged = items.stream().filter(i -> i.getStatus() == AuditItemStatus.DAMAGED).count();
        long discrepancy = items.stream().filter(i -> i.getStatus() == AuditItemStatus.DISCREPANCY).count();

        return AuditSummaryResponse.builder()
                .auditCycleId(cycleId)
                .name(cycle.getName())
                .status(cycle.getStatus())
                .totalItems(total)
                .pendingItems(pending)
                .verifiedItems(verified)
                .missingItems(missing)
                .damagedItems(damaged)
                .discrepancyItems(discrepancy)
                .build();
    }

    private AuditCycleResponse mapToCycleResponse(AuditCycle cycle) {
        return AuditCycleResponse.builder()
                .id(cycle.getId())
                .name(cycle.getName())
                .description(cycle.getDescription())
                .startDate(cycle.getStartDate())
                .endDate(cycle.getEndDate())
                .createdDate(cycle.getCreatedDate())
                .status(cycle.getStatus())
                .build();
    }

    private AuditItemResponse mapToItemResponse(AuditItem item) {
        return AuditItemResponse.builder()
                .id(item.getId())
                .auditCycleId(item.getAuditCycle().getId())
                .assetId(item.getAsset().getId())
                .assetTag(item.getAsset().getTag())
                .assetName(item.getAsset().getName())
                .auditorId(item.getAuditor() != null ? item.getAuditor().getId() : null)
                .auditorEmail(item.getAuditor() != null ? item.getAuditor().getEmail() : null)
                .auditDate(item.getAuditDate())
                .status(item.getStatus())
                .notes(item.getNotes())
                .build();
    }
}
