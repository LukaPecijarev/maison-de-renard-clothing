package com.example.maisonderenard.model.exceptions;

public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(String username) {
        super("No pending order found for user: " + username);
    }
}
