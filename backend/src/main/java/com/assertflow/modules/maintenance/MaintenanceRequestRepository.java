package com.assertflow.modules.maintenance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, UUID> {
    List<MaintenanceRequest> findByAssetId(UUID assetId);

    List<MaintenanceRequest> findByReporterId(UUID reporterId);
}
