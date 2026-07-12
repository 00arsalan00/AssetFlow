package com.assertflow.modules.organization.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AssetCategoryRequest {
    @NotBlank(message = "Category name is required")
    private String name;
}
