package com.example.maisonderenard.dto.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterUserResponseDto {
    private String username;
    private String email;
    private String role;
}
