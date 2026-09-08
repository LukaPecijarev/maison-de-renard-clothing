package com.example.maisonderenard.web.exceptions;

import com.example.maisonderenard.model.exceptions.InvalidPasswordException;
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
}
