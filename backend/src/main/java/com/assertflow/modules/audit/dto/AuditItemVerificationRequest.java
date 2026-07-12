package com.assertflow.modules.audit.dto;

import com.assertflow.modules.audit.AuditItemStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class AuditItemVerificationRequest {
    @NotNull(message = "Auditor user ID is required")
    private UUID auditorId;

    @NotNull(message = "Audit result status is required")
    private AuditItemStatus status;

    private String notes;
}
