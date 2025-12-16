package com.example.maisonderenard.service.domain.impl;

import com.example.maisonderenard.model.domain.Order;
import com.example.maisonderenard.model.domain.Product;
import com.example.maisonderenard.model.exceptions.ProductOutOfStockException;
import com.example.maisonderenard.repository.OrderRepository;
import com.example.maisonderenard.repository.ProductRepository;
import com.example.maisonderenard.service.domain.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public ProductServiceImpl(ProductRepository productRepository, OrderRepository orderRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public List<Product> findByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    @Override
    public Product save(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Optional<Product> update(Long id, Product product) {
        return findById(id)
                .map(existingProduct -> {
                    existingProduct.setName(product.getName());
                    existingProduct.setDescription(product.getDescription());
                    existingProduct.setPrice(product.getPrice());
                    existingProduct.setQuantity(product.getQuantity());
                    existingProduct.setImageUrl(product.getImageUrl());
                    existingProduct.setCategory(product.getCategory());
                    return productRepository.save(existingProduct);
                });
    }

    @Override
    public Optional<Product> deleteById(Long id) {
        Optional<Product> product = findById(id);
        product.ifPresent(productRepository::delete);
        return product;
    }

    @Override
    public Order addToOrder(Product product, Order order) {
        if(product.getQuantity() <= 0){
            throw new ProductOutOfStockException(product.getId());
        }
        product.decreaseQuantity();
        productRepository.save(product);
        order.getProducts().add(product);
        return orderRepository.save(order);
    }

    @Override
    public Order removeFromOrder(Product product, Order order) {
        product.increaseQuantity();
        productRepository.save(product);
        order.getProducts().remove(product);
        return orderRepository.save(order);
    }
}
