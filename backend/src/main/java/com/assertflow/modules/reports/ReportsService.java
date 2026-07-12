package com.assertflow.modules.reports;

import com.assertflow.modules.assets.Asset;
import com.assertflow.modules.assets.AssetRepository;
import com.assertflow.modules.assets.AssetStatus;
import com.assertflow.modules.reports.dto.DashboardKPIResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReportsService {

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private ActivityLogRepository logRepository;

    @Transactional
    public void logActivity(String email, String action, String details) {
        ActivityLog log = ActivityLog.builder()
                .timestamp(LocalDateTime.now())
                .userEmail(email != null ? email : "system@assertflow.io")
                .action(action)
                .details(details)
                .build();
        logRepository.save(log);
    }

    @Transactional(readOnly = true)
    public DashboardKPIResponse getDashboardKPIs() {
        List<Asset> assets = assetRepository.findAll();

        long total = assets.size();
        long available = assets.stream().filter(a -> a.getStatus() == AssetStatus.AVAILABLE).count();
        long allocated = assets.stream().filter(a -> a.getStatus() == AssetStatus.ALLOCATED).count();
        long reserved = assets.stream().filter(a -> a.getStatus() == AssetStatus.RESERVED).count();
        long maintenance = assets.stream().filter(a -> a.getStatus() == AssetStatus.UNDER_MAINTENANCE).count();

        BigDecimal totalCost = assets.stream()
                .map(Asset::getCost)
                .filter(cost -> cost != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Long> byCategory = assets.stream()
                .collect(Collectors.groupingBy(a -> a.getCategory().getName(), Collectors.counting()));

        return DashboardKPIResponse.builder()
                .totalAssets(total)
                .assetsAvailable(available)
                .assetsAllocated(allocated)
                .assetsReserved(reserved)
                .assetsUnderMaintenance(maintenance)
                .totalAssetCost(totalCost)
                .assetsByCategory(byCategory)
                .build();
    }

    @Transactional(readOnly = true)
    public List<ActivityLog> getRecentLogs() {
        return logRepository.findTop100ByOrderByTimestampDesc();
    }
}
