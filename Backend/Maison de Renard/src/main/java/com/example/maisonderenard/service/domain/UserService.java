package com.example.maisonderenard.service.domain;

import com.example.maisonderenard.model.domain.User;

import java.util.Optional;

public interface UserService {

    Optional<User> findByUsername(String username);

    User save(User user);
}
