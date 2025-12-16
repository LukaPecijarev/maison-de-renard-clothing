package com.example.maisonderenard.service.application;

import com.example.maisonderenard.dto.domain.CreateCategoryDto;
import com.example.maisonderenard.dto.domain.DisplayCategoryDto;

import java.util.List;
import java.util.Optional;

public interface CategoryApplicationService {

    List<DisplayCategoryDto> findAll();

    Optional<DisplayCategoryDto> findById(Long id);

    DisplayCategoryDto save(CreateCategoryDto createCategoryDto);

    Optional<DisplayCategoryDto> update(Long id, CreateCategoryDto createCategoryDto);

    Optional<DisplayCategoryDto> deleteById(Long id);
}
