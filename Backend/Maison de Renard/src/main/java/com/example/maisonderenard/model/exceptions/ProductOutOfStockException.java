package com.example.maisonderenard.model.exceptions;

public class ProductOutOfStockException extends RuntimeException {
    public ProductOutOfStockException(Long id) {
        super("Product with id " + id + " is out of stock");
    }
}
