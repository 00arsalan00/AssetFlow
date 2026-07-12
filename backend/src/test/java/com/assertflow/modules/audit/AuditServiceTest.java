package com.assertflow.modules.audit;

import com.assertflow.modules.assets.Asset;
import com.assertflow.modules.assets.AssetRepository;
import com.assertflow.modules.assets.AssetStatus;
import com.assertflow.modules.auth.Role;
import com.assertflow.modules.auth.User;
import com.assertflow.modules.auth.UserRepository;
import com.assertflow.modules.auth.UserStatus;
import com.assertflow.modules.audit.dto.*;
import com.assertflow.modules.organization.AssetCategory;
import com.assertflow.modules.organization.AssetCategoryRepository;
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
public class AuditServiceTest {

    @Autowired
    private AuditService auditService;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AssetCategoryRepository categoryRepository;

    @Autowired
    private AuditItemRepository itemRepository;

    private User auditorUser;
    private Asset laptop1;
    private Asset laptop2;

    @BeforeEach
    public void setup() {
        itemRepository.deleteAll();

        auditorUser = User.builder()
                .name("Alice Auditor")
                .email("alice.auditor@assertflow.io")
                .password("auditor_password")
                .role(Role.ASSET_MANAGER)
                .status(UserStatus.ACTIVE)
                .build();
        auditorUser = userRepository.save(auditorUser);

        AssetCategory cat = AssetCategory.builder().name("Lenovo Laptops").build();
        cat = categoryRepository.save(cat);

        laptop1 = Asset.builder()
                .tag("AST-L111")
                .name("ThinkPad X1 Carbon")
                .serialNumber("SN-X1-1111")
                .category(cat)
                .acquisitionDate(LocalDate.now())
                .cost(new BigDecimal("1800.00"))
                .condition("NEW")
                .location("HQ - Office 4A")
                .isBookable(false)
                .status(AssetStatus.AVAILABLE)
                .build();
        laptop1 = assetRepository.save(laptop1);

        laptop2 = Asset.builder()
                .tag("AST-L222")
                .name("ThinkPad L13")
                .serialNumber("SN-L13-2222")
                .category(cat)
                .acquisitionDate(LocalDate.now())
                .cost(new BigDecimal("950.00"))
                .condition("GOOD")
                .location("HQ - Office 4B")
                .isBookable(false)
                .status(AssetStatus.AVAILABLE)
                .build();
        laptop2 = assetRepository.save(laptop2);
    }

    @Test
    public void testFullAuditCycleWorkflow() {
        // 1. Create a new Audit Cycle
        AuditCycleRequest cycleReq = new AuditCycleRequest();
        cycleReq.setName("Q3 Hardware Physical Check");
        cycleReq.setDescription("Verifying all user laptops in HQ.");

        AuditCycleResponse cycleRes = auditService.createAuditCycle(cycleReq);
        assertNotNull(cycleRes.getId());
        assertEquals(AuditCycleStatus.ACTIVE, cycleRes.getStatus());

        // 2. Assert that check items are automatically seeded for BOTH assets
        List<AuditItemResponse> items = auditService.getCycleItems(cycleRes.getId());
        assertEquals(2, items.size());

        AuditItemResponse item1 = items.stream().filter(i -> i.getAssetId().equals(laptop1.getId())).findFirst()
                .orElseThrow();
        AuditItemResponse item2 = items.stream().filter(i -> i.getAssetId().equals(laptop2.getId())).findFirst()
                .orElseThrow();
        assertEquals(AuditItemStatus.PENDING, item1.getStatus());
        assertEquals(AuditItemStatus.PENDING, item2.getStatus());

        // 3. Verify Item 1 as VERIFIED
        AuditItemVerificationRequest verifyReq1 = new AuditItemVerificationRequest();
        verifyReq1.setAuditorId(auditorUser.getId());
        verifyReq1.setStatus(AuditItemStatus.VERIFIED);
        verifyReq1.setNotes("Verified physically in Office 4A. Perfect state.");

        AuditItemResponse itemRes1 = auditService.verifyAuditItem(item1.getId(), verifyReq1);
        assertEquals(AuditItemStatus.VERIFIED, itemRes1.getStatus());
        assertEquals(auditorUser.getEmail(), itemRes1.getAuditorEmail());

        // 4. Verify Item 2 as DAMAGED (should trigger asset state change)
        AuditItemVerificationRequest verifyReq2 = new AuditItemVerificationRequest();
        verifyReq2.setAuditorId(auditorUser.getId());
        verifyReq2.setStatus(AuditItemStatus.DAMAGED);
        verifyReq2.setNotes("Found with cracked screen panel.");

        AuditItemResponse itemRes2 = auditService.verifyAuditItem(item2.getId(), verifyReq2);
        assertEquals(AuditItemStatus.DAMAGED, itemRes2.getStatus());

        // Verify that the laptop2 state changed to UNDER_MAINTENANCE and condition is
        // DAMAGED
        Asset updatedLaptop2 = assetRepository.findById(laptop2.getId()).orElseThrow();
        assertEquals("DAMAGED", updatedLaptop2.getCondition());
        assertEquals(AssetStatus.UNDER_MAINTENANCE, updatedLaptop2.getStatus());

        // 5. Get Summary Report
        AuditSummaryResponse summary = auditService.getAuditSummary(cycleRes.getId());
        assertEquals(2, summary.getTotalItems());
        assertEquals(0, summary.getPendingItems());
        assertEquals(1, summary.getVerifiedItems());
        assertEquals(1, summary.getDamagedItems());
        assertEquals(0, summary.getMissingItems());

        // 6. Complete Audit Cycle
        AuditCycleResponse closedCycle = auditService.completeAuditCycle(cycleRes.getId());
        assertEquals(AuditCycleStatus.COMPLETED, closedCycle.getStatus());
        assertNotNull(closedCycle.getEndDate());
    }
}
