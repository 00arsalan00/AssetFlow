package com.assertflow.modules.assets.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class AssetRequest {
    @NotBlank(message = "Asset name is required")
    private String name;

    @NotBlank(message = "Serial number is required")
    private String serialNumber;

    @NotNull(message = "Category ID is required")
    private UUID categoryId;

    private LocalDate acquisitionDate;

    @NotNull(message = "Cost is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Cost must be zero or positive")
    private BigDecimal cost;

    @NotBlank(message = "Condition is required")
    private String condition; // NEW, GOOD, DAMAGED

    @NotBlank(message = "Location is required")
    private String location;

    private boolean isBookable;
}
