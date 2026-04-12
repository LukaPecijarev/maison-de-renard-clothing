package com.example.maisonderenard.service.domain.impl;

import com.example.maisonderenard.model.domain.Order;
import com.example.maisonderenard.model.domain.SoldProduct;
import com.example.maisonderenard.repository.OrderRepository;
import com.example.maisonderenard.repository.SoldProductRepository;
import com.example.maisonderenard.service.domain.OrderService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final SoldProductRepository soldProductRepository;

    public OrderServiceImpl(OrderRepository orderRepository, SoldProductRepository soldProductRepository) {
        this.orderRepository = orderRepository;
        this.soldProductRepository = soldProductRepository;
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

    @Override
    public Order cancelOrder(Order order) {
        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }
}