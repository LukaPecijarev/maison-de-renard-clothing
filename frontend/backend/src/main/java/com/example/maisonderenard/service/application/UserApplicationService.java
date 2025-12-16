package com.example.maisonderenard.service.application;

import com.example.maisonderenard.dto.domain.LoginUserRequestDto;
import com.example.maisonderenard.dto.domain.LoginUserResponseDto;
import com.example.maisonderenard.dto.domain.RegisterUserRequestDto;
import com.example.maisonderenard.dto.domain.RegisterUserResponseDto;

public interface UserApplicationService {

    RegisterUserResponseDto register(RegisterUserRequestDto registerDto);

    LoginUserResponseDto login(LoginUserRequestDto loginDto);
}