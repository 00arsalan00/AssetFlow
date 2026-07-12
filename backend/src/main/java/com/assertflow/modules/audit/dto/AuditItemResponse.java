package com.assertflow.modules.audit.dto;

import com.assertflow.modules.audit.AuditItemStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class AuditItemResponse {
    private UUID id;
    private UUID auditCycleId;
    private UUID assetId;
    private String assetTag;
    private String assetName;
    private UUID auditorId;
    private String auditorEmail;
    private LocalDateTime auditDate;
    private AuditItemStatus status;
    private String notes;
}
