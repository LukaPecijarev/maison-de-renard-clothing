package com.example.maisonderenard.service.domain;

import com.example.maisonderenard.model.domain.Order;
import java.util.List;
import java.util.Optional;

public interface OrderService {

    Optional<Order> findById(Long id);

    Optional<Order> findPendingOrderByUsername(String username);

    List<Order> findOrderHistoryByUsername(String username);

    Order save(Order order);

    Order confirmOrder(Order order);

    Order cancelOrder(Order order);
}
