package mk.ukim.finki.fooddeliverybackend.service.domain.impl;

import jakarta.transaction.Transactional;
import mk.ukim.finki.fooddeliverybackend.model.domain.Dish;
import mk.ukim.finki.fooddeliverybackend.model.domain.Order;
import mk.ukim.finki.fooddeliverybackend.model.domain.User;
import mk.ukim.finki.fooddeliverybackend.model.enums.OrderStatus;
import mk.ukim.finki.fooddeliverybackend.model.exceptions.DishNotFoundException;
import mk.ukim.finki.fooddeliverybackend.model.exceptions.DishOutOfStockException;
import mk.ukim.finki.fooddeliverybackend.model.exceptions.EmptyOrderException;
import mk.ukim.finki.fooddeliverybackend.model.exceptions.UserNotFoundException;
import mk.ukim.finki.fooddeliverybackend.repository.DishRepository;
import mk.ukim.finki.fooddeliverybackend.repository.OrderRepository;
import mk.ukim.finki.fooddeliverybackend.repository.UserRepository;
import mk.ukim.finki.fooddeliverybackend.service.domain.OrderService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final DishRepository dishRepository;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            UserRepository userRepository,
            DishRepository dishRepository
    ) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.dishRepository = dishRepository;
    }

    @Override
    public Optional<Order> findPending(String username) {
        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));
        return orderRepository
                .findByUserAndStatus(user, OrderStatus.PENDING);
    }

    @Override
    public Order findOrCreatePending(String username) {
        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));
        return findPending(username)
                .orElseGet(() -> orderRepository.save(new Order(user)));
    }

    @Override
    public Optional<Order> confirm(String username) {
        Optional<Order> order = findPending(username);
        if (order.isPresent() && order.get().getDishes().isEmpty())
            throw new EmptyOrderException();
        return order
                .map(o -> {
                    o.confirm();
                    return orderRepository.save(o);
                });
    }

    @Override
    public Optional<Order> cancel(String username) {
        Optional<Order> order = findPending(username);
        if (order.isPresent() && order.get().getDishes().isEmpty())
            throw new EmptyOrderException();
        return order
                .map(o -> {
                    o.cancel();
                    return orderRepository.save(o);
                });
    }

}
