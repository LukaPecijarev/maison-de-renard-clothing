package com.example.maisonderenard.dto.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DisplayProductDetailsDto {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer quantity;
    private String imageUrl;
    private DisplayCategoryDto category;
    private String color;
    private String season;
    private String material;
    private String gender;
    private String style;
    private String size;
}
