package com.assertflow.modules.audit.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuditCycleRequest {
    @NotBlank(message = "Cycle name is required")
    private String name;

    private String description;
}
