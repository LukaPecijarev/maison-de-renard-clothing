package com.example.maisonderenard.service.domain.impl;

import com.example.maisonderenard.model.domain.Category;
import com.example.maisonderenard.repository.CategoryRepository;
import com.example.maisonderenard.service.domain.CategoryService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    private static final String CATEGORIES_CACHE = "categories";
    // A category rename/delete also changes what the product caches return
    // (DisplayProductDto embeds the category name), so those need evicting too.
    private static final String PRODUCTS_CACHE = "products";
    private static final String PRODUCTS_BY_CATEGORY_CACHE = "productsByCategory";

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Cacheable(CATEGORIES_CACHE)
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id);
    }

    @Override
    @CacheEvict(cacheNames = { CATEGORIES_CACHE, PRODUCTS_CACHE, PRODUCTS_BY_CATEGORY_CACHE }, allEntries = true)
    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    @CacheEvict(cacheNames = { CATEGORIES_CACHE, PRODUCTS_CACHE, PRODUCTS_BY_CATEGORY_CACHE }, allEntries = true)
    public Optional<Category> update(Long id, Category category) {
        return findById(id)
                .map(existingCategory -> {
                    existingCategory.setName(category.getName());
                    existingCategory.setDescription(category.getDescription());
                    return categoryRepository.save(existingCategory);
                });
    }

    @Override
    @CacheEvict(cacheNames = { CATEGORIES_CACHE, PRODUCTS_CACHE, PRODUCTS_BY_CATEGORY_CACHE }, allEntries = true)
    public Optional<Category> deleteById(Long id) {
        Optional<Category> category = findById(id);
        category.ifPresent(categoryRepository::delete);
        return category;
    }
}
