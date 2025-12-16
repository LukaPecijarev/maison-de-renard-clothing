package com.example.maisonderenard.dto.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DisplayOrderDto {
    private Long id;
    private String username;
    private List<DisplayProductDto> products;
    private LocalDateTime createdAt;
    private String status;
    private Double totalPrice;
}
