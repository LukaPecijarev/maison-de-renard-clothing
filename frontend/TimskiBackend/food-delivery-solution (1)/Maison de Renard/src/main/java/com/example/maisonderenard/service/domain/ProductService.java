package com.example.maisonderenard.service.domain;

import com.example.maisonderenard.model.domain.Order;
import com.example.maisonderenard.model.domain.Product;

import java.util.List;
import java.util.Optional;

public interface ProductService {

    List<Product> findAll();

    Optional<Product> findById(Long id);

    List<Product> findByCategoryId(Long categoryId);

    Product save(Product product);

    Optional<Product> update(Long id,Product product);

    Optional<Product> deleteById(Long id);

    Order addToOrder (Product product, Order order);

    Order removeFromOrder (Product product, Order order);
}
