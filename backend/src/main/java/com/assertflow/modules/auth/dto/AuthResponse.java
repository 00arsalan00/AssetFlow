package com.assertflow.modules.auth.dto;

import com.assertflow.modules.auth.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {
    private String name;
    private String email;
    private Role role;
    private String token;
}
