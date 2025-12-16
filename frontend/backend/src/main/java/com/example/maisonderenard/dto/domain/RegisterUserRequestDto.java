package com.example.maisonderenard.dto.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterUserRequestDto {
    private String username;
    private String password;
    private String email;
}
