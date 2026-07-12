package com.assertflow.modules.reports.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
public class DashboardKPIResponse {
    private long totalAssets;
    private long assetsAvailable;
    private long assetsAllocated;
    private long assetsReserved;
    private long assetsUnderMaintenance;
    private BigDecimal totalAssetCost;
    private Map<String, Long> assetsByCategory;
}
