package com.example.maisonderenard.service.application.impl;

import com.example.maisonderenard.dto.domain.CreateCategoryDto;
import com.example.maisonderenard.dto.domain.DisplayCategoryDto;
import com.example.maisonderenard.model.domain.Category;
import com.example.maisonderenard.service.application.CategoryApplicationService;
import com.example.maisonderenard.service.domain.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryApplicationServiceImpl implements CategoryApplicationService {

    private final CategoryService categoryService;

    public CategoryApplicationServiceImpl(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @Override
    public List<DisplayCategoryDto> findAll() {
        return categoryService.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<DisplayCategoryDto> findById(Long id) {
        return categoryService.findById(id)
                .map(this::mapToDto);
    }

    @Override
    public DisplayCategoryDto save(CreateCategoryDto createCategoryDto) {
        Category category = new Category();
        category.setName(createCategoryDto.getName());
        category.setDescription(createCategoryDto.getDescription());

        Category savedCategory = categoryService.save(category);
        return mapToDto(savedCategory);
    }

    @Override
    public Optional<DisplayCategoryDto> update(Long id, CreateCategoryDto createCategoryDto) {
        Category category = new Category();
        category.setName(createCategoryDto.getName());
        category.setDescription(createCategoryDto.getDescription());

        return categoryService.update(id,category)
                .map(this::mapToDto);
    }

    @Override
    public Optional<DisplayCategoryDto> deleteById(Long id) {
        return categoryService.deleteById(id)
                .map(this::mapToDto);
    }

    private DisplayCategoryDto mapToDto(Category category) {
        return new DisplayCategoryDto(category.getId(), category.getName(), category.getDescription());
    }
}
