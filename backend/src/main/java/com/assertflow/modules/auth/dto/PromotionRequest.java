package com.assertflow.modules.auth.dto;

import com.assertflow.modules.auth.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PromotionRequest {
    @NotNull(message = "Role is required")
    private Role role;
}
