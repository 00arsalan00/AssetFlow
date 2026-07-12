package com.assertflow.modules.audit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface AuditCycleRepository extends JpaRepository<AuditCycle, UUID> {
}
