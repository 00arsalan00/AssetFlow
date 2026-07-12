package com.assertflow.modules.assets;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface AllocationRepository extends JpaRepository<Allocation, UUID> {
    List<Allocation> findByUserId(UUID userId);

    List<Allocation> findByAssetId(UUID assetId);
}
