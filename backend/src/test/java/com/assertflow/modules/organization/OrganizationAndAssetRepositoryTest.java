package com.assertflow.modules.organization;

import com.assertflow.modules.assets.Asset;
import com.assertflow.modules.assets.AssetRepository;
import com.assertflow.modules.assets.AssetStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class OrganizationAndAssetRepositoryTest {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AssetCategoryRepository assetCategoryRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Test
    public void testDepartmentHierarchyPersistence() {
        // 1. Save parent department
        Department parentDept = Department.builder()
                .name("Engineering")
                .status("ACTIVE")
                .build();
        parentDept = departmentRepository.save(parentDept);
        assertNotNull(parentDept.getId());

        // 2. Save child department referencing parent
        Department childDept = Department.builder()
                .name("Backend Engineering")
                .status("ACTIVE")
                .parentDepartmentId(parentDept.getId())
                .build();
        childDept = departmentRepository.save(childDept);
        assertNotNull(childDept.getId());

        // 3. Query and verify relationships
        Department foundChild = departmentRepository.findById(childDept.getId()).orElse(null);
        assertNotNull(foundChild);
        assertEquals(parentDept.getId(), foundChild.getParentDepartmentId());
        assertEquals("Backend Engineering", foundChild.getName());
    }

    @Test
    public void testAssetAndCategoryPersistence() {
        // 1. Save asset category
        AssetCategory category = AssetCategory.builder()
                .name("Electronics")
                .build();
        category = assetCategoryRepository.save(category);
        assertNotNull(category.getId());

        // 2. Save asset linking to category
        Asset asset = Asset.builder()
                .tag("AF-0001")
                .name("MacBook Pro M3")
                .serialNumber("SN-MACBOOK123")
                .category(category)
                .acquisitionDate(LocalDate.now())
                .cost(new BigDecimal("1999.99"))
                .condition("NEW")
                .location("Room 302")
                .isBookable(false)
                .status(AssetStatus.AVAILABLE)
                .build();
        asset = assetRepository.save(asset);
        assertNotNull(asset.getId());

        // 3. Query by ID and assert
        Asset foundAsset = assetRepository.findById(asset.getId()).orElse(null);
        assertNotNull(foundAsset);
        assertEquals("AF-0001", foundAsset.getTag());
        assertEquals(category.getId(), foundAsset.getCategory().getId());
        assertEquals(AssetStatus.AVAILABLE, foundAsset.getStatus());

        // 4. Test Repository custom queries
        Optional<Asset> foundByTag = assetRepository.findByTag("AF-0001");
        assertTrue(foundByTag.isPresent());
        assertEquals("SN-MACBOOK123", foundByTag.get().getSerialNumber());

        Optional<Asset> foundBySN = assetRepository.findBySerialNumber("SN-MACBOOK123");
        assertTrue(foundBySN.isPresent());
        assertEquals("AF-0001", foundBySN.get().getTag());

        Optional<Asset> foundByNonExistentSN = assetRepository.findBySerialNumber("SN-NONEXISTENT");
        assertFalse(foundByNonExistentSN.isPresent());
    }
}
