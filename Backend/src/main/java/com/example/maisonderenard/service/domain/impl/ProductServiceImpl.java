package com.example.maisonderenard.service.domain.impl;

import com.example.maisonderenard.model.domain.Order;
import com.example.maisonderenard.model.domain.Product;
import com.example.maisonderenard.model.exceptions.ProductOutOfStockException;
import com.example.maisonderenard.repository.OrderItemRepository;
import com.example.maisonderenard.repository.OrderRepository;
import com.example.maisonderenard.repository.ProductRepository;
import com.example.maisonderenard.service.domain.ProductService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final OrderItemRepository orderItemRepository;

    public ProductServiceImpl(ProductRepository productRepository, OrderRepository orderRepository,
                              OrderItemRepository orderItemRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
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
                    existingProduct.setDiscountPercentage(product.getDiscountPercentage());
                    return productRepository.save(existingProduct);
                });
    }

    @Override
    @Transactional
    @CacheEvict(cacheNames = { PRODUCTS_CACHE, PRODUCTS_BY_CATEGORY_CACHE }, allEntries = true)
    public Optional<Product> deleteById(Long id) {
        Optional<Product> product = findById(id);
        product.ifPresent(p -> {
            // order_products has a foreign key to products, so a product that is in
            // anyone's cart or in a past order couldn't be deleted at all (the
            // database rejected it). Take it out of those orders first:
            //  - carts: the item is removed and the total recalculated;
            //  - past orders: they're displayed from their OrderItem snapshot (taken
            //    first here if somehow missing), so they keep showing the product -
            //    image included - and keep the total that was actually charged.
            // Sales analytics are unaffected (sold_products is a snapshot too).
            for (Order order : orderRepository.findAllContainingProduct(p.getId())) {
                if ("PENDING".equals(order.getStatus())) {
                    order.getProducts().removeIf(item -> item.getId().equals(p.getId()));
                    order.calculateTotalPrice();
                } else {
                    order.snapshotItems();
                    order.getProducts().removeIf(item -> item.getId().equals(p.getId()));
                }
                orderRepository.save(order);
            }
            orderRepository.flush();
            orderItemRepository.unlinkProduct(p.getId());
            productRepository.delete(p);
        });
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
        order.calculateTotalPrice();
        return orderRepository.save(order);
    }

    @Override
    @CacheEvict(cacheNames = { PRODUCTS_CACHE, PRODUCTS_BY_CATEGORY_CACHE }, allEntries = true)
    public Order removeFromOrder(Product product, Order order) {
        product.increaseQuantity();
        productRepository.save(product);
        order.getProducts().remove(product);
        order.calculateTotalPrice();
        return orderRepository.save(order);
    }
}
