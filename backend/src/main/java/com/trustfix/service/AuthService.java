package com.trustfix.service;

import com.trustfix.entity.User;
import com.trustfix.entity.UserRole;
import com.trustfix.exception.BadRequestException;
import com.trustfix.repository.UserRepository;
import com.trustfix.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User register(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BadRequestException(
                    "User with email '" + user.getEmail() + "' already exists"
            );
        }

        if (user.getPhone() != null
                && !user.getPhone().isBlank()
                && userRepository.existsByPhone(user.getPhone())) {
            throw new BadRequestException(
                    "User with phone number '" + user.getPhone() + "' already exists"
            );
        }

        // Every new registration starts as CUSTOMER
        user.setRole(UserRole.CUSTOMER);

        // Password is stored as BCrypt hash
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public String login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BadRequestException("Invalid email or password"));

        if (!user.isActive()) {
            throw new BadRequestException("User account is inactive");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        return jwtService.generateToken(user);
    }
}