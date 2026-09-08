package com.example.maisonderenard.model.exceptions;

public class InvalidPasswordException extends RuntimeException {
    public InvalidPasswordException() {
        super("Incorrect password");
    }
}
