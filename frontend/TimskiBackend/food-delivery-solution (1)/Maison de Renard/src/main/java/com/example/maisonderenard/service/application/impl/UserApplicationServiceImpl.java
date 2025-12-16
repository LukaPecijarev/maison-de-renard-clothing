package com.example.maisonderenard.service.application.impl;

import com.example.maisonderenard.dto.domain.LoginUserRequestDto;
import com.example.maisonderenard.dto.domain.LoginUserResponseDto;
import com.example.maisonderenard.dto.domain.RegisterUserRequestDto;
import com.example.maisonderenard.dto.domain.RegisterUserResponseDto;
import com.example.maisonderenard.helpers.JwtHelper;
import com.example.maisonderenard.model.domain.User;
import com.example.maisonderenard.model.enums.Role;
import com.example.maisonderenard.model.exceptions.UserNotFoundException;
import com.example.maisonderenard.service.application.UserApplicationService;
import com.example.maisonderenard.service.domain.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserApplicationServiceImpl implements UserApplicationService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtHelper jwtHelper;

    public UserApplicationServiceImpl(
            UserService userService,
            PasswordEncoder passwordEncoder, JwtHelper jwtHelper

    ) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtHelper = jwtHelper;
    }

    @Override
    public RegisterUserResponseDto register(RegisterUserRequestDto registerDto) {
        // 1. Create user entity
        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword())); // Encrypt password!
        user.setEmail(registerDto.getEmail());
        user.setRole(Role.CUSTOMER); // Default role

        // 2. Save user
        User savedUser = userService.save(user);

        // 3. Return response DTO (NO PASSWORD!)
        return new RegisterUserResponseDto(
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
    }

    @Override
    public LoginUserResponseDto login(LoginUserRequestDto loginDto) {
        // 1. Find user
        User user = userService.findByUsername(loginDto.getUsername())
                .orElseThrow(() -> new UserNotFoundException(loginDto.getUsername()));

        // 2. Check password
        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // 3. Generate JWT token (we'll add this later!)
        String token = jwtHelper.generateToken(user);

        // 4. Return response
        return new LoginUserResponseDto(
                token,
                user.getUsername(),
                user.getRole().name()
        );
    }
}