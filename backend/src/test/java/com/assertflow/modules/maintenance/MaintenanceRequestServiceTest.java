package com.assertflow.modules.maintenance;

import com.assertflow.modules.assets.Asset;
import com.assertflow.modules.assets.AssetRepository;
import com.assertflow.modules.assets.AssetStatus;
import com.assertflow.modules.auth.Role;
import com.assertflow.modules.auth.User;
import com.assertflow.modules.auth.UserRepository;
import com.assertflow.modules.auth.UserStatus;
import com.assertflow.modules.maintenance.dto.MaintenanceRequestRequest;
import com.assertflow.modules.maintenance.dto.MaintenanceRequestResponse;
import com.assertflow.modules.organization.AssetCategory;
import com.assertflow.modules.organization.AssetCategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class MaintenanceRequestServiceTest {

    @Autowired
    private MaintenanceRequestService service;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AssetCategoryRepository categoryRepository;

    private User employee;
    private Asset laptop;

    @BeforeEach
    public void setup() {
        employee = User.builder()
                .name("Joe Tech")
                .email("joe@assertflow.io")
                .password("super_secret")
                .role(Role.EMPLOYEE)
                .status(UserStatus.ACTIVE)
                .build();
        employee = userRepository.save(employee);

        AssetCategory cat = AssetCategory.builder().name("MacBooks").build();
        cat = categoryRepository.save(cat);

        laptop = Asset.builder()
                .tag("AST-M001")
                .name("MacBook Pro 16")
                .serialNumber("SN-MAC-777")
                .category(cat)
                .acquisitionDate(LocalDate.now())
                .cost(new BigDecimal("2500.00"))
                .condition("NEW")
                .location("HQ - Floor 3")
                .isBookable(false)
                .status(AssetStatus.AVAILABLE)
                .build();
        laptop = assetRepository.save(laptop);
    }

    @Test
    public void testMaintenanceStateTransitions() {
        // 1. Create maintenance request
        MaintenanceRequestRequest req = new MaintenanceRequestRequest();
        req.setAssetId(laptop.getId());
        req.setReporterId(employee.getId());
        req.setDescription("Screen flickering issue on MacBook Pro.");
        req.setPriority(MaintenancePriority.HIGH);
        req.setCost(new BigDecimal("150.00"));

        MaintenanceRequestResponse res = service.createRequest(req);
        assertNotNull(res.getId());
        assertEquals(MaintenanceStatus.PENDING, res.getStatus());
        assertEquals(AssetStatus.AVAILABLE, laptop.getStatus()); // remains AVAILABLE while pending

        // 2. Approve request (should flip asset status)
        MaintenanceRequestResponse approved = service.updateStatus(res.getId(), "APPROVED",
                "Approved for third-party diagnostics.");
        assertEquals(MaintenanceStatus.APPROVED, approved.getStatus());

        Asset updatedAsset1 = assetRepository.findById(laptop.getId()).orElseThrow();
        assertEquals(AssetStatus.UNDER_MAINTENANCE, updatedAsset1.getStatus());

        // 3. Set request in progress
        MaintenanceRequestResponse inProgress = service.updateStatus(res.getId(), "IN_PROGRESS",
                "Diagnostics started.");
        assertEquals(MaintenanceStatus.IN_PROGRESS, inProgress.getStatus());

        Asset updatedAsset2 = assetRepository.findById(laptop.getId()).orElseThrow();
        assertEquals(AssetStatus.UNDER_MAINTENANCE, updatedAsset2.getStatus());

        // 4. Resolve request (should clean tag and state back to AVAILABLE)
        MaintenanceRequestResponse resolved = service.updateStatus(res.getId(), "RESOLVED",
                "Replaced display connector panel.");
        assertEquals(MaintenanceStatus.RESOLVED, resolved.getStatus());
        assertEquals("Replaced display connector panel.", resolved.getResolutionNotes());

        Asset updatedAsset3 = assetRepository.findById(laptop.getId()).orElseThrow();
        assertEquals(AssetStatus.AVAILABLE, updatedAsset3.getStatus());
    }
}
