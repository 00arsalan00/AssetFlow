package com.assertflow.modules.maintenance.dto;

import com.assertflow.modules.maintenance.MaintenancePriority;
import com.assertflow.modules.maintenance.MaintenanceStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class MaintenanceRequestResponse {
    private UUID id;
    private UUID assetId;
    private String assetTag;
    private String assetName;
    private UUID reporterId;
    private String reporterEmail;
    private String description;
    private LocalDate reportedDate;
    private MaintenancePriority priority;
    private MaintenanceStatus status;
    private String resolutionNotes;
    private BigDecimal cost;
}
