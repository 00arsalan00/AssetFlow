package com.assertflow.modules.maintenance.dto;

import com.assertflow.modules.maintenance.MaintenancePriority;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class MaintenanceRequestRequest {
    @NotNull(message = "Asset ID is required")
    private UUID assetId;

    @NotNull(message = "Reporter user ID is required")
    private UUID reporterId;

    @NotBlank(message = "Description of the maintenance concern is required")
    private String description;

    @NotNull(message = "Priority is required")
    private MaintenancePriority priority;

    @NotNull(message = "Estimated cost is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Cost must be zero or positive")
    private BigDecimal cost;
}
