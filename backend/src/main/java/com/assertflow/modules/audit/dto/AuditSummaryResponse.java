package com.assertflow.modules.audit.dto;

import com.assertflow.modules.audit.AuditCycleStatus;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class AuditSummaryResponse {
    private UUID auditCycleId;
    private String name;
    private AuditCycleStatus status;
    private long totalItems;
    private long pendingItems;
    private long verifiedItems;
    private long missingItems;
    private long damagedItems;
    private long discrepancyItems;
}
