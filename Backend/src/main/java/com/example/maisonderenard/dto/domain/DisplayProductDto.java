package com.example.maisonderenard.dto.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DisplayProductDto {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer quantity;
    private String imageUrl;
    private Long categoryId;
    private String categoryName;
}
