
package com.example.maisonderenard.service.application;

import com.example.maisonderenard.dto.domain.CreateProductDto;
import com.example.maisonderenard.dto.domain.DisplayProductDetailsDto;
import com.example.maisonderenard.dto.domain.DisplayProductDto;
import com.example.maisonderenard.dto.domain.DisplayOrderDto;

import java.util.List;
import java.util.Optional;

public interface ProductApplicationService {

    List<DisplayProductDto> findAll();

    Optional<DisplayProductDto> findById(Long id);

    Optional<DisplayProductDetailsDto> findByIdWithDetails(Long id);

    List<DisplayProductDto> findByCategoryId(Long categoryId);

    DisplayProductDto save(CreateProductDto createProductDto);

    Optional<DisplayProductDto> update(Long id, CreateProductDto createProductDto);

    Optional<DisplayProductDto> deleteById(Long id);

    DisplayOrderDto addToOrder(Long id, String username);

    DisplayOrderDto removeFromOrder(Long id, String username);
}