package mk.ukim.finki.fooddeliverybackend.service.domain.impl;

import mk.ukim.finki.fooddeliverybackend.model.domain.Dish;
import mk.ukim.finki.fooddeliverybackend.model.domain.Order;
import mk.ukim.finki.fooddeliverybackend.model.exceptions.DishOutOfStockException;
import mk.ukim.finki.fooddeliverybackend.repository.DishRepository;
import mk.ukim.finki.fooddeliverybackend.repository.OrderRepository;
import mk.ukim.finki.fooddeliverybackend.service.domain.DishService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DishServiceImpl implements DishService {

    private final DishRepository dishRepository;
    private final OrderRepository orderRepository;

    public DishServiceImpl(DishRepository dishRepository, OrderRepository orderRepository) {
        this.dishRepository = dishRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public List<Dish> findAll() {
        return dishRepository.findAll();
    }

    @Override
    public Optional<Dish> findById(Long id) {
        return dishRepository.findById(id);
    }

    @Override
    public Dish save(Dish dish) {
        return dishRepository.save(dish);
    }

    @Override
    public Optional<Dish> update(Long id, Dish dish) {
        return findById(id)
                .map(existingMenuItem -> {
                    existingMenuItem.setName(dish.getName());
                    existingMenuItem.setDescription(dish.getDescription());
                    existingMenuItem.setPrice(dish.getPrice());
                    existingMenuItem.setQuantity(dish.getQuantity());
                    existingMenuItem.setRestaurant(dish.getRestaurant());
                    return dishRepository.save(existingMenuItem);
                });
    }

    @Override
    public Optional<Dish> deleteById(Long id) {
        Optional<Dish> dish = findById(id);
        dish.ifPresent(dishRepository::delete);
        return dish;
    }

    @Override
    public Order addToOrder(Dish dish, Order order) {
        if (dish.getQuantity() <= 0)
            throw new DishOutOfStockException(dish.getId());
        dish.decreaseQuantity();
        dishRepository.save(dish);
        order.getDishes().add(dish);
        return orderRepository.save(order);
    }

    @Override
    public Order removeFromOrder(Dish dish, Order order) {
        dish.increaseQuantity();
        dishRepository.save(dish);
        order.getDishes().remove(dish);
        return orderRepository.save(order);
    }

}
