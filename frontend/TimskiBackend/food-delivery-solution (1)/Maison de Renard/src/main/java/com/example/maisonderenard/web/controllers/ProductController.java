package com.example.maisonderenard.web.controllers;

import com.example.maisonderenard.dto.domain.CreateProductDto;
import com.example.maisonderenard.dto.domain.DisplayOrderDto;
import com.example.maisonderenard.dto.domain.DisplayProductDetailsDto;
import com.example.maisonderenard.dto.domain.DisplayProductDto;
import com.example.maisonderenard.model.domain.User;
import com.example.maisonderenard.service.application.ProductApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductApplicationService productApplicationService;

    public ProductController(ProductApplicationService productApplicationService) {
        this.productApplicationService = productApplicationService;
    }

    @GetMapping
    public ResponseEntity<List<DisplayProductDto>> findAll(){
        return ResponseEntity.ok(productApplicationService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisplayProductDto> findById(@PathVariable Long id){
        return productApplicationService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<DisplayProductDetailsDto> findByIdWithDetails(@PathVariable Long id){
        return productApplicationService.findByIdWithDetails(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<DisplayProductDto>> findByCategoryId(@PathVariable Long categoryId){
        return ResponseEntity.ok(productApplicationService.findByCategoryId(categoryId));
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DisplayProductDto> save(@RequestBody CreateProductDto createProductDto){
        return ResponseEntity.ok(productApplicationService.save(createProductDto));
    }

    @PutMapping("/{id}/edit")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DisplayProductDto> update(@PathVariable Long id, @RequestBody CreateProductDto createProductDto){
        return productApplicationService.update(id,createProductDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DisplayProductDto> deleteById(@PathVariable Long id){
        return productApplicationService.deleteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/add-to-cart")
    @PreAuthorize("hasRole('CUSTOMER')")  // ✅ Correct - will match ROLE_CUSTOMER from JWT
    public ResponseEntity<DisplayOrderDto> addToCart(@PathVariable Long id, @AuthenticationPrincipal User user){
        return ResponseEntity.ok(productApplicationService.addToOrder(id, user.getUsername()));
    }

    @PostMapping("/{id}/remove-from-cart")
    @PreAuthorize("hasRole('CUSTOMER')")  // ✅ Correct - will match ROLE_CUSTOMER from JWT
    public ResponseEntity<DisplayOrderDto> removeFromCart(@PathVariable Long id, @AuthenticationPrincipal User user){
        return ResponseEntity.ok(productApplicationService.removeFromOrder(id, user.getUsername()));
    }
}