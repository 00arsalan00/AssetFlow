package com.assertflow.modules.auth;

import com.assertflow.modules.auth.dto.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testSignupAndLoginFlow() throws Exception {
        // 1. Sign up new employee
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("John Doe");
        registerRequest.setEmail("john.doe@assertflow.com");
        registerRequest.setPassword("securePassword123");

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Doe"))
                .andExpect(jsonPath("$.email").value("john.doe@assertflow.com"))
                .andExpect(jsonPath("$.role").value("EMPLOYEE"));

        // Verify saved user in repository
        User user = userRepository.findByEmail("john.doe@assertflow.com").orElse(null);
        assertNotNull(user);
        assertEquals(Role.EMPLOYEE, user.getRole());

        // 2. Login with correct credentials
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("john.doe@assertflow.com");
        loginRequest.setPassword("securePassword123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());

        // 3. Login with incorrect credentials (should fail)
        loginRequest.setPassword("wrongPassword");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testRoleBasedPromotion() throws Exception {
        // Create an employee to promote
        User employee = User.builder()
                .name("Test Employee")
                .email("test.emp@assertflow.com")
                .password("$2a$10$xyz") // dummy encoded pass
                .role(Role.EMPLOYEE)
                .status(UserStatus.ACTIVE)
                .build();
        employee = userRepository.save(employee);

        PromotionRequest promoRequest = new PromotionRequest();
        promoRequest.setRole(Role.ASSET_MANAGER);

        // Try promoting without credentials (should fail 401)
        mockMvc.perform(post("/api/auth/promote/" + employee.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(promoRequest)))
                .andExpect(status().isUnauthorized());

        // Try promoting as standard employee (should fail 403)
        mockMvc.perform(post("/api/auth/promote/" + employee.getId())
                .with(httpBasic("employee@assertflow.com", "employee123"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(promoRequest)))
                .andExpect(status().isForbidden());

        // Promote as Admin (should succeed 200)
        mockMvc.perform(post("/api/auth/promote/" + employee.getId())
                .with(httpBasic("admin@assertflow.com", "admin123"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(promoRequest)))
                .andExpect(status().isOk());

        // Verify change in DB
        User updatedUser = userRepository.findById(employee.getId()).orElse(null);
        assertNotNull(updatedUser);
        assertEquals(Role.ASSET_MANAGER, updatedUser.getRole());
    }
}
