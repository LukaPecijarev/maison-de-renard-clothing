package com.example.maisonderenard.model.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "sold_products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SoldProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column
    private Double price;

    @Column
    private String color;

    @Column
    private String material;

    @Column
    private String season;

    @Column
    private String size;

    @Column
    private String category;

    @Column
    private LocalDateTime soldAt;
}