package com.example.maisonderenard.model.domain;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer quantity;

    @Column(length = 1000)
    private String imageUrl;

    @Column
    private String color;

    @Column
    private String season;

    @Column
    private String material;

    @Column
    private String gender;

    @Column
    private String style;

    @Column
    private String size;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    public void decreaseQuantity(){
        if(this.quantity > 0){
            this.quantity--;
        }
    }

    public void increaseQuantity(){
        this.quantity++;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }

    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getStyle() { return style; }
    public void setStyle(String style) { this.style = style; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
}
