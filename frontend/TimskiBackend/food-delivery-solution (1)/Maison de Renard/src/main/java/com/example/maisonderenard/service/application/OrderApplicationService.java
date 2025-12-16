package com.example.maisonderenard.service.application;

import com.example.maisonderenard.dto.domain.DisplayOrderDto;

import java.util.List;
import java.util.Optional;

public interface OrderApplicationService {

    Optional<DisplayOrderDto> findPendingOrder(String username);

    List<DisplayOrderDto> findOrderHistory(String username);

    DisplayOrderDto confirmPendingOrder(String username);

    DisplayOrderDto cancelPendingOrder(String username);
}
