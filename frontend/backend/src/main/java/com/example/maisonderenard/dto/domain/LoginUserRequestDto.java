package com.example.maisonderenard.dto.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginUserRequestDto {
    private String username;
    private String password;
}
