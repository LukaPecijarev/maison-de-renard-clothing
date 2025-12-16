package com.example.maisonderenard.model.exceptions;

public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(Long id) {
        super("Product with id " + id + " not found");
    }
}
