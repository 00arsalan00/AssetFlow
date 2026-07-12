package com.assertflow.modules.audit.dto;

import com.assertflow.modules.audit.AuditCycleStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class AuditCycleResponse {
    private UUID id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate createdDate;
    private AuditCycleStatus status;
}
