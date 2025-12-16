package com.example.maisonderenard.model.exceptions;

public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException(Long id) {
        super("Category with id " + id + " not found");
    }
}
