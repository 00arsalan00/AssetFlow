package com.assertflow.modules.auth;

import com.assertflow.modules.auth.dto.AuthResponse;
import com.assertflow.modules.auth.dto.LoginRequest;
import com.assertflow.modules.auth.dto.RegisterRequest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.EMPLOYEE) // Default role is EMPLOYEE, no self-assigned admin
                .status(UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);
        return new AuthResponse(savedUser.getName(), savedUser.getEmail(), savedUser.getRole(),
                "MOCK_TOKEN_" + savedUser.getId());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new IllegalStateException("User account is inactive");
        }

        return new AuthResponse(user.getName(), user.getEmail(), user.getRole(), "MOCK_TOKEN_" + user.getId());
    }

    @Transactional
    public User promote(UUID userId, Role targetRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user.setRole(targetRole);
        return userRepository.save(user);
    }
}
