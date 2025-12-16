package com.example.maisonderenard.service.domain;

import com.example.maisonderenard.model.domain.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryService {

    List<Category> findAll();

    Optional<Category> findById(Long id);

    Category save(Category category);

    Optional<Category> update(Long id, Category category);

    Optional<Category> deleteById(Long id);
}
