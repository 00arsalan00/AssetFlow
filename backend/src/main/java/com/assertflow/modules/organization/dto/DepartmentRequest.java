package com.assertflow.modules.organization.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.UUID;

@Data
public class DepartmentRequest {
    @NotBlank(message = "Department name is required")
    private String name;

    @NotBlank(message = "Status is required")
    private String status;

    private UUID departmentHeadId;
    private UUID parentDepartmentId;
}
