package com.example.maisonderenard.service.domain.impl;


import com.example.maisonderenard.model.domain.Order;
import com.example.maisonderenard.repository.OrderRepository;
import com.example.maisonderenard.service.domain.OrderService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }

    @Override
    public Optional<Order> findPendingOrderByUsername(String username) {
        return orderRepository.findByUserUsernameAndStatus(username,"PENDING");
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
