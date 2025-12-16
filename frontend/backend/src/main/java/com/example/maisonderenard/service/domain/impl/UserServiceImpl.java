package com.example.maisonderenard.service.domain.impl;

import com.example.maisonderenard.model.domain.User;
import com.example.maisonderenard.repository.UserRepository;
import com.example.maisonderenard.service.domain.UserService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }
}
