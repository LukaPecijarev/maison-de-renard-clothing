package com.example.maisonderenard.web.controllers;

import com.example.maisonderenard.dto.domain.LoginUserRequestDto;
import com.example.maisonderenard.dto.domain.LoginUserResponseDto;
import com.example.maisonderenard.dto.domain.RegisterUserRequestDto;
import com.example.maisonderenard.dto.domain.RegisterUserResponseDto;
import com.example.maisonderenard.service.application.UserApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserApplicationService userApplicationService;

    public UserController(UserApplicationService userApplicationService) {
        this.userApplicationService = userApplicationService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterUserResponseDto> register(@RequestBody RegisterUserRequestDto requestDto) {
        return ResponseEntity.ok(userApplicationService.register(requestDto));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginUserResponseDto> login(@RequestBody LoginUserRequestDto loginDto) {
        return ResponseEntity.ok(userApplicationService.login(loginDto));
    }
}
