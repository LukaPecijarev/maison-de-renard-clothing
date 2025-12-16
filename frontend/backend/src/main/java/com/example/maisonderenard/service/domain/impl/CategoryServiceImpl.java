package com.example.maisonderenard.service.domain.impl;

import com.example.maisonderenard.model.domain.Category;
import com.example.maisonderenard.repository.CategoryRepository;
import com.example.maisonderenard.service.domain.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id);
    }

    @Override
    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public Optional<Category> update(Long id, Category category) {
        return findById(id)
                .map(existingCategory -> {
                    existingCategory.setName(category.getName());
                    existingCategory.setDescription(category.getDescription());
                    return categoryRepository.save(existingCategory);
                });
    }

    @Override
    public Optional<Category> deleteById(Long id) {
        Optional<Category> category = findById(id);
        category.ifPresent(categoryRepository::delete);
        return category;
    }
}
