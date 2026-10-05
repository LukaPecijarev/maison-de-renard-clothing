package com.example.maisonderenard.service.application.impl;

import com.example.maisonderenard.dto.domain.DisplayCategoryDto;
import com.example.maisonderenard.dto.domain.DisplayOrderDto;
import com.example.maisonderenard.dto.domain.DisplayProductDto;
import com.example.maisonderenard.model.domain.Order;
import com.example.maisonderenard.model.domain.OrderItem;
import com.example.maisonderenard.model.domain.Product;
import com.example.maisonderenard.model.exceptions.OrderNotFoundException;
import com.example.maisonderenard.service.application.OrderApplicationService;
import com.example.maisonderenard.service.domain.OrderService;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderApplicationServiceImpl implements OrderApplicationService {

    private final OrderService orderService;

    public OrderApplicationServiceImpl(OrderService orderService) {
        this.orderService = orderService;
    }

    @Override
    public Optional<DisplayOrderDto> findPendingOrder(String username) {
        // Recompute on read so the cart reflects price/discount changes made to its
        // products since they were added (the stored value catches up on next save).
        return orderService.findPendingOrderByUsername(username)
                .map(order -> {
                    order.calculateTotalPrice();
                    return mapToDto(order);
                });
    }

    @Override
    public List<DisplayOrderDto> findOrderHistory(String username) {
        // The current (PENDING) order always comes first, then the rest by id.
        return orderService.findOrderHistoryByUsername(username).stream()
                .sorted(Comparator
                        .comparing((Order order) -> !"PENDING".equals(order.getStatus()))
                        .thenComparing(Order::getId))
                .map(order -> {
                    // Same as findPendingOrder: show the cart's current total, not
                    // a possibly stale stored one.
                    if ("PENDING".equals(order.getStatus())) order.calculateTotalPrice();
                    return mapToDto(order);
                })
                .collect(Collectors.toList());
    }

    @Override
    public DisplayOrderDto confirmPendingOrder(String username) {
        Order order = orderService.findPendingOrderByUsername(username)
                .orElseThrow(() -> new OrderNotFoundException(username));

        Order confirmedOrder = orderService.confirmOrder(order);
        return mapToDto(confirmedOrder);
    }

    @Override
    public DisplayOrderDto cancelPendingOrder(String username) {
        Order order = orderService.findPendingOrderByUsername(username)
                .orElseThrow(() -> new OrderNotFoundException(username));

        Order cancelledOrder = orderService.cancelOrder(order);
        return mapToDto(cancelledOrder);
    }

    // Helper methods for mapping
    private DisplayOrderDto mapToDto(Order order) {
        // Past orders show their snapshot (so deleted/edited products still appear
        // as bought); a cart - or an old order without a snapshot - the live products.
        List<DisplayProductDto> productDtos = !"PENDING".equals(order.getStatus()) && !order.getItems().isEmpty()
                ? order.getItems().stream().map(this::mapItemToDto).collect(Collectors.toList())
                : order.getProducts().stream().map(this::mapProductToDto).collect(Collectors.toList());

        return new DisplayOrderDto(
                order.getId(),
                order.getUser().getUsername(),
                productDtos,
                order.getCreatedAt(),
                order.getStatus(),
                order.getTotalPrice()
        );
    }

    // id is null once the product has been deleted - the frontend uses that to
    // show the line without linking to a page that no longer exists.
    private DisplayProductDto mapItemToDto(OrderItem item) {
        return new DisplayProductDto(
                item.getProductId(),
                item.getName(),
                null,
                item.getPrice(),
                null,
                item.getImageUrl(),
                null,
                item.getCategoryName(),
                item.getColor(),
                null,
                null,
                null,
                null,
                item.getSize(),
                null
        );
    }

    private DisplayProductDto mapProductToDto(Product product) {
        return new DisplayProductDto(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getQuantity(),
                product.getImageUrl(),
                product.getCategory().getId(),
                product.getCategory().getName(),
                product.getColor(),
                product.getSeason(),
                product.getMaterial(),
                product.getGender(),
                product.getStyle(),
                product.getSize(),
                product.getDiscountPercentage()
        );
    }
}