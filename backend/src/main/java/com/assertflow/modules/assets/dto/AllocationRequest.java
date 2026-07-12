package com.assertflow.modules.assets.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class AllocationRequest {
    @NotNull(message = "Asset ID is required")
    private UUID assetId;

    @NotNull(message = "User ID is required")
    private UUID userId;

    private LocalDate allocatedDate;

    private LocalDate dueDate;

    private String notes;
}
