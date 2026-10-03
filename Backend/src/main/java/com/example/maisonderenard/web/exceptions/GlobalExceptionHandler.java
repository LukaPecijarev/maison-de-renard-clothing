package com.example.maisonderenard.web.exceptions;

import com.example.maisonderenard.model.exceptions.CategoryNotFoundException;
import com.example.maisonderenard.model.exceptions.InvalidPasswordException;
import com.example.maisonderenard.model.exceptions.OrderNotFoundException;
import com.example.maisonderenard.model.exceptions.ProductNotFoundException;
import com.example.maisonderenard.model.exceptions.ProductOutOfStockException;
import com.example.maisonderenard.model.exceptions.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

// Without this, both of login's failure cases (UserApplicationServiceImpl.login())
// fell through to Spring Boot's default error response - a bare 500 with no
// message body - so the frontend (LoginPage.jsx, reading err.response.data.message)
// always showed the same generic fallback text instead of a real login error.
//
// UserNotFoundException and InvalidPasswordException are still two distinct
// exceptions internally, but deliberately map to the same message here rather
// than "wrong username" / "wrong password" specifically - revealing which one
// failed lets someone probe for valid usernames (username enumeration).
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({ UserNotFoundException.class, InvalidPasswordException.class })
    public ResponseEntity<Map<String, String>> handleLoginFailure(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Username or password is incorrect"));
    }

    @ExceptionHandler({
            ProductNotFoundException.class,
            CategoryNotFoundException.class,
            OrderNotFoundException.class
    })
    public ResponseEntity<Map<String, String>> handleNotFound(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
    }

    // 409 rather than 400: the request itself is valid, it just conflicts with
    // the product's current stock level.
    @ExceptionHandler(ProductOutOfStockException.class)
    public ResponseEntity<Map<String, String>> handleOutOfStock(ProductOutOfStockException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", e.getMessage()));
    }
}
