package com.assertflow.modules.reports;

import com.assertflow.modules.assets.Asset;
import com.assertflow.modules.assets.AssetRepository;
import com.assertflow.modules.assets.AssetStatus;
import com.assertflow.modules.organization.AssetCategory;
import com.assertflow.modules.organization.AssetCategoryRepository;
import com.assertflow.modules.reports.dto.DashboardKPIResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class ReportsServiceTest {

    @Autowired
    private ReportsService reportsService;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private AssetCategoryRepository categoryRepository;

    @Autowired
    private ActivityLogRepository logRepository;

    private AssetCategory laptopCategory;

    @BeforeEach
    public void setup() {
        logRepository.deleteAll();
        assetRepository.deleteAll();

        laptopCategory = AssetCategory.builder().name("Test Laptops").build();
        laptopCategory = categoryRepository.save(laptopCategory);

        Asset laptop1 = Asset.builder()
                .tag("AST-T111")
                .name("Test Laptop 1")
                .serialNumber("SN-T1")
                .category(laptopCategory)
                .acquisitionDate(LocalDate.now())
                .cost(new BigDecimal("1000.00"))
                .condition("NEW")
                .location("HQ")
                .isBookable(false)
                .status(AssetStatus.AVAILABLE)
                .build();
        assetRepository.save(laptop1);

        Asset laptop2 = Asset.builder()
                .tag("AST-T222")
                .name("Test Laptop 2")
                .serialNumber("SN-T2")
                .category(laptopCategory)
                .acquisitionDate(LocalDate.now())
                .cost(new BigDecimal("1500.00"))
                .condition("GOOD")
                .location("HQ")
                .isBookable(false)
                .status(AssetStatus.ALLOCATED)
                .build();
        assetRepository.save(laptop2);
    }

    @Test
    public void testActivityLogger() {
        // 1. Log an activity
        reportsService.logActivity("admin@assertflow.io", "TEST", "Testing reports logger system integration.");

        // 2. Fetch recent logs
        List<ActivityLog> logs = reportsService.getRecentLogs();
        assertEquals(1, logs.size());
        assertEquals("admin@assertflow.io", logs.get(0).getUserEmail());
        assertEquals("TEST", logs.get(0).getAction());
        assertEquals("Testing reports logger system integration.", logs.get(0).getDetails());
    }

    @Test
    public void testDashboardKPIAggregations() {
        // Fetch KPIs
        DashboardKPIResponse kpis = reportsService.getDashboardKPIs();

        assertEquals(2, kpis.getTotalAssets());
        assertEquals(1, kpis.getAssetsAvailable());
        assertEquals(1, kpis.getAssetsAllocated());
        assertEquals(0, kpis.getAssetsUnderMaintenance());
        assertEquals(new BigDecimal("2500.00"), kpis.getTotalAssetCost());

        // Assert category distribution
        assertTrue(kpis.getAssetsByCategory().containsKey("Test Laptops"));
        assertEquals(2L, kpis.getAssetsByCategory().get("Test Laptops"));
    }
}
