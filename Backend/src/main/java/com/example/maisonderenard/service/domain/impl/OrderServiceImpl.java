package com.example.maisonderenard.service.domain.impl;

import com.example.maisonderenard.model.domain.Order;
import com.example.maisonderenard.model.domain.SoldProduct;
import com.example.maisonderenard.repository.OrderRepository;
import com.example.maisonderenard.repository.ProductRepository;
import com.example.maisonderenard.repository.SoldProductRepository;
import com.example.maisonderenard.service.domain.OrderService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final SoldProductRepository soldProductRepository;
    private final ProductRepository productRepository;

    public OrderServiceImpl(OrderRepository orderRepository, SoldProductRepository soldProductRepository,
                            ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.soldProductRepository = soldProductRepository;
        this.productRepository = productRepository;
    }

    @Override
    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }

    @Override
    public Optional<Order> findPendingOrderByUsername(String username) {
        return orderRepository.findByUserUsernameAndStatus(username, "PENDING");
    }

    @Override
    public List<Order> findOrderHistoryByUsername(String username) {
        return orderRepository.findByUserUsername(username);
    }

    @Override
    public Order save(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public Order confirmOrder(Order order) {
        // 1. Зачувај ги производите во sold_products
        order.getProducts().forEach(product -> {
            SoldProduct soldProduct = new SoldProduct();
            soldProduct.setName(product.getName());
            soldProduct.setPrice(product.getPrice());
            soldProduct.setColor(product.getColor());
            soldProduct.setMaterial(product.getMaterial());
            soldProduct.setSeason(product.getSeason());
            soldProduct.setSize(product.getSize());
            soldProduct.setCategory(product.getCategory().getName());
            soldProduct.setSoldAt(LocalDateTime.now());
            soldProductRepository.save(soldProduct);
        });

        // 2. НЕ бриши - само смени статус на CONFIRMED
        order.setStatus("CONFIRMED");
        order.calculateTotalPrice();
        return orderRepository.save(order);
    }

    // Stock is reserved when an item is added to the cart (addToOrder decreases
    // the product's quantity), so cancelling has to give it back - same as
    // removeFromOrder does per item. Evicts the product caches for the same reason.
    @Override
    @CacheEvict(cacheNames = { "products", "productsByCategory" }, allEntries = true)
    public Order cancelOrder(Order order) {
        order.getProducts().forEach(product -> {
            product.increaseQuantity();
            productRepository.save(product);
        });
        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }
}