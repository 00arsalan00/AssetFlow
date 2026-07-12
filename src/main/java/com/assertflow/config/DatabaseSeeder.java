package com.assertflow.config;

import com.assertflow.modules.auth.Role;
import com.assertflow.modules.auth.User;
import com.assertflow.modules.auth.UserRepository;
import com.assertflow.modules.auth.UserStatus;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Seed Admin
            userRepository.save(User.builder()
                    .name("System Admin")
                    .email("admin@assertflow.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build());

            // Seed Asset Manager
            userRepository.save(User.builder()
                    .name("Priya Kumar")
                    .email("manager@assertflow.com")
                    .password(passwordEncoder.encode("manager123"))
                    .role(Role.ASSET_MANAGER)
                    .status(UserStatus.ACTIVE)
                    .build());

            // Seed Department Head
            userRepository.save(User.builder()
                    .name("Rajesh Patel")
                    .email("head@assertflow.com")
                    .password(passwordEncoder.encode("head123"))
                    .role(Role.DEPARTMENT_HEAD)
                    .status(UserStatus.ACTIVE)
                    .build());

            // Seed Standard Employee
            userRepository.save(User.builder()
                    .name("Amit Sharma")
                    .email("employee@assertflow.com")
                    .password(passwordEncoder.encode("employee123"))
                    .role(Role.EMPLOYEE)
                    .status(UserStatus.ACTIVE)
                    .build());

            System.out.println("assertflow database seeding completed successfully.");
        }
    }
}
