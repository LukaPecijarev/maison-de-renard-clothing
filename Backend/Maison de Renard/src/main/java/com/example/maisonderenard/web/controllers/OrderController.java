package com.example.maisonderenard.web.controllers;

import com.example.maisonderenard.dto.domain.DisplayOrderDto;
import com.example.maisonderenard.model.domain.User;
import com.example.maisonderenard.service.application.OrderApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderApplicationService orderApplicationService;

    public OrderController(OrderApplicationService orderApplicationService) {
        this.orderApplicationService = orderApplicationService;
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/pending")
    public ResponseEntity<DisplayOrderDto> getPendingOrder(@AuthenticationPrincipal User user){
        return orderApplicationService.findPendingOrder(user.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(new DisplayOrderDto()));
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/history")
    public ResponseEntity<List<DisplayOrderDto>> getOrderHistory(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(orderApplicationService.findOrderHistory(user.getUsername()));
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/pending/confirm")
    public ResponseEntity<DisplayOrderDto> confirmPendingOrder(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(orderApplicationService.confirmPendingOrder(user.getUsername()));
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/pending/cancel")
    public ResponseEntity<DisplayOrderDto> cancelPendingOrder(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(orderApplicationService.cancelPendingOrder(user.getUsername()));
    }
}
