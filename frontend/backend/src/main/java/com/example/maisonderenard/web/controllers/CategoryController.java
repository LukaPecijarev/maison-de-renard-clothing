package com.example.maisonderenard.web.controllers;

import com.example.maisonderenard.dto.domain.CreateCategoryDto;
import com.example.maisonderenard.dto.domain.DisplayCategoryDto;
import com.example.maisonderenard.service.application.CategoryApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ResourceBundle;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryApplicationService categoryApplicationService;

    public CategoryController(CategoryApplicationService categoryApplicationService) {
        this.categoryApplicationService = categoryApplicationService;
    }

    @GetMapping
    public ResponseEntity<List<DisplayCategoryDto>> findAll(){
        return ResponseEntity.ok(categoryApplicationService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisplayCategoryDto> findById(@PathVariable Long id){
        return categoryApplicationService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DisplayCategoryDto> save(@RequestBody CreateCategoryDto createCategoryDto){
        return ResponseEntity.ok(categoryApplicationService.save(createCategoryDto));
    }

    @PutMapping("/{id}/edit")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DisplayCategoryDto> update(@PathVariable Long id,@RequestBody CreateCategoryDto createCategoryDto){
        return categoryApplicationService.update(id,createCategoryDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DisplayCategoryDto> deleteById(@PathVariable Long id){
        return categoryApplicationService.deleteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
