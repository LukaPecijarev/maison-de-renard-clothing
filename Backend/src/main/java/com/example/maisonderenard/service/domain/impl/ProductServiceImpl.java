package com.example.maisonderenard.service.domain.impl;

import com.example.maisonderenard.model.domain.Order;
import com.example.maisonderenard.model.domain.Product;
import com.example.maisonderenard.model.exceptions.ProductOutOfStockException;
import com.example.maisonderenard.repository.OrderRepository;
import com.example.maisonderenard.repository.ProductRepository;
import com.example.maisonderenard.service.domain.ProductService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    // Cache names shared with CategoryServiceImpl, which also evicts these -
    // a category rename/delete changes what findAll()/findByCategoryId() return
    // (DisplayProductDto embeds the category name), so it can't just evict its own cache.
    private static final String PRODUCTS_CACHE = "products";
    private static final String PRODUCTS_BY_CATEGORY_CACHE = "productsByCategory";

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public ProductServiceImpl(ProductRepository productRepository, OrderRepository orderRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Cacheable(PRODUCTS_CACHE)
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    @Cacheable(cacheNames = PRODUCTS_BY_CATEGORY_CACHE, key = "#categoryId")
    public List<Product> findByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    @Override
    @CacheEvict(cacheNames = { PRODUCTS_CACHE, PRODUCTS_BY_CATEGORY_CACHE }, allEntries = true)
    public Product save(Product product) {
        return productRepository.save(product);
    }

    @Override
    @CacheEvict(cacheNames = { PRODUCTS_CACHE, PRODUCTS_BY_CATEGORY_CACHE }, allEntries = true)
    public Optional<Product> update(Long id, Product product) {
        return findById(id)
                .map(existingProduct -> {
                    existingProduct.setName(product.getName());
                    existingProduct.setDescription(product.getDescription());
                    existingProduct.setPrice(product.getPrice());
                    existingProduct.setQuantity(product.getQuantity());
                    existingProduct.setImageUrl(product.getImageUrl());
                    existingProduct.setCategory(product.getCategory());
                    existingProduct.setColor(product.getColor());
                    existingProduct.setSeason(product.getSeason());
                    existingProduct.setMaterial(product.getMaterial());
                    existingProduct.setGender(product.getGender());
                    existingProduct.setStyle(product.getStyle());
                    existingProduct.setSize(product.getSize());
                    return productRepository.save(existingProduct);
                });
    }

    @Override
    @CacheEvict(cacheNames = { PRODUCTS_CACHE, PRODUCTS_BY_CATEGORY_CACHE }, allEntries = true)
    public Optional<Product> deleteById(Long id) {
        Optional<Product> product = findById(id);
        product.ifPresent(productRepository::delete);
        return product;
    }

    @Override
    @CacheEvict(cacheNames = { PRODUCTS_CACHE, PRODUCTS_BY_CATEGORY_CACHE }, allEntries = true)
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
    @CacheEvict(cacheNames = { PRODUCTS_CACHE, PRODUCTS_BY_CATEGORY_CACHE }, allEntries = true)
    public Order removeFromOrder(Product product, Order order) {
        product.increaseQuantity();
        productRepository.save(product);
        order.getProducts().remove(product);
        return orderRepository.save(order);
    }
}
