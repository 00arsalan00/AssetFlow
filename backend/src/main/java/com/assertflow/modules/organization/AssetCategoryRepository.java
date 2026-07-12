package com.assertflow.modules.organization;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface AssetCategoryRepository extends JpaRepository<AssetCategory, UUID> {
}
