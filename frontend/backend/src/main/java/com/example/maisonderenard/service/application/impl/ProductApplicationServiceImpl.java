package com.example.maisonderenard.service.application;

import com.example.maisonderenard.dto.domain.*;
import com.example.maisonderenard.model.domain.Category;
import com.example.maisonderenard.model.domain.Order;
import com.example.maisonderenard.model.domain.Product;
import com.example.maisonderenard.model.domain.User;
import com.example.maisonderenard.model.exceptions.CategoryNotFoundException;
import com.example.maisonderenard.model.exceptions.OrderNotFoundException;
import com.example.maisonderenard.model.exceptions.ProductNotFoundException;
import com.example.maisonderenard.model.exceptions.UserNotFoundException;
import com.example.maisonderenard.service.domain.CategoryService;
import com.example.maisonderenard.service.domain.OrderService;
import com.example.maisonderenard.service.domain.ProductService;
import com.example.maisonderenard.service.domain.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductApplicationServiceImpl implements ProductApplicationService {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final OrderService orderService;
    private final UserService userService;

    public ProductApplicationServiceImpl(
            ProductService productService,
            CategoryService categoryService,
            OrderService orderService,
            UserService userService
    ) {
        this.productService = productService;
        this.categoryService = categoryService;
        this.orderService = orderService;
        this.userService = userService;
    }

    @Override
    public List<DisplayProductDto> findAll() {
        return productService.findAll().stream()
                .map(this::mapToDisplayDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<DisplayProductDto> findById(Long id) {
        return productService.findById(id)
                .map(this::mapToDisplayDto);
    }

    @Override
    public Optional<DisplayProductDetailsDto> findByIdWithDetails(Long id) {
        return productService.findById(id)
                .map(this::mapToDetailsDto);
    }

    @Override
    public List<DisplayProductDto> findByCategoryId(Long categoryId) {
        return productService.findByCategoryId(categoryId).stream()
                .map(this::mapToDisplayDto)
                .collect(Collectors.toList());
    }

    @Override
    public DisplayProductDto save(CreateProductDto createProductDto) {
        Category category = categoryService.findById(createProductDto.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException(createProductDto.getCategoryId()));

        Product product = new Product();
        product.setName(createProductDto.getName());
        product.setDescription(createProductDto.getDescription());
        product.setPrice(createProductDto.getPrice());
        product.setQuantity(createProductDto.getQuantity());
        product.setImageUrl(createProductDto.getImageUrl());
        product.setCategory(category);

        Product savedProduct = productService.save(product);
        return mapToDisplayDto(savedProduct);
    }

    @Override
    public Optional<DisplayProductDto> update(Long id, CreateProductDto createProductDto) {
        Category category = categoryService.findById(createProductDto.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException(createProductDto.getCategoryId()));

        Product product = new Product();
        product.setName(createProductDto.getName());
        product.setDescription(createProductDto.getDescription());
        product.setPrice(createProductDto.getPrice());
        product.setQuantity(createProductDto.getQuantity());
        product.setImageUrl(createProductDto.getImageUrl());
        product.setCategory(category);

        return productService.update(id, product)
                .map(this::mapToDisplayDto);
    }

    @Override
    public Optional<DisplayProductDto> deleteById(Long id) {
        return productService.deleteById(id)
                .map(this::mapToDisplayDto);
    }

    @Override
    public DisplayOrderDto addToOrder(Long id, String username) {
        Product product = productService.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        User user = userService.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        Order order = orderService.findPendingOrderByUsername(username)
                .orElseGet(() -> {
                    Order newOrder = new Order();
                    newOrder.setUser(user);
                    return newOrder;
                });

        Order updatedOrder = productService.addToOrder(product, order);
        return mapOrderToDto(updatedOrder);
    }

    @Override
    public DisplayOrderDto removeFromOrder(Long id, String username) {
        Product product = productService.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        Order order = orderService.findPendingOrderByUsername(username)
                .orElseThrow(() -> new OrderNotFoundException(username));

        Order updatedOrder = productService.removeFromOrder(product, order);
        return mapOrderToDto(updatedOrder);
    }

    // Helper methods for mapping Entity → DTO
    private DisplayProductDto mapToDisplayDto(Product product) {
        return new DisplayProductDto(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getQuantity(),
                product.getImageUrl(),
                product.getCategory().getId(),
                product.getCategory().getName()
        );
    }

    private DisplayProductDetailsDto mapToDetailsDto(Product product) {
        DisplayCategoryDto categoryDto = new DisplayCategoryDto(
                product.getCategory().getId(),
                product.getCategory().getName(),
                product.getCategory().getDescription()
        );

        return new DisplayProductDetailsDto(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getQuantity(),
                product.getImageUrl(),
                categoryDto
        );
    }

    private DisplayOrderDto mapOrderToDto(Order order) {
        List<DisplayProductDto> productDtos = order.getProducts().stream()
                .map(this::mapToDisplayDto)
                .collect(Collectors.toList());

        return new DisplayOrderDto(
                order.getId(),
                order.getUser().getUsername(),
                productDtos,
                order.getCreatedAt(),
                order.getStatus(),
                order.getTotalPrice()
        );
    }
}