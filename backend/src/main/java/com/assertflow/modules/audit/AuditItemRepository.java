package com.assertflow.modules.audit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuditItemRepository extends JpaRepository<AuditItem, UUID> {
    List<AuditItem> findByAuditCycleId(UUID auditCycleId);

    List<AuditItem> findByAuditCycleIdAndStatus(UUID auditCycleId, AuditItemStatus status);
}
