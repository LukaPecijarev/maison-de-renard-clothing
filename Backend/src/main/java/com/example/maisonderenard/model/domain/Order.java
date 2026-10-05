package com.example.maisonderenard.model.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToMany
    @JoinTable(
            name = "order_products",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<Product> products = new ArrayList<>();

    // Snapshot of what was bought, taken when the order leaves the cart (see
    // OrderItem). Past orders are displayed from this, so they keep showing
    // products that were later edited or deleted. Empty while PENDING.
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Double totalPrice = 0.0;

    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
        if(status == null){
            status = "PENDING";
        }
        if(totalPrice == null) {
            totalPrice = 0.0;
        }
        calculateTotalPrice();
    }

    // Only fires when one of the order's own columns changes (e.g. status).
    // Changing just the products list doesn't make Hibernate treat the order row
    // as dirty, so add/remove-from-cart also call calculateTotalPrice() explicitly.
    // Carts only: a past order's total is what was actually charged and must not
    // be recomputed from whatever products still exist.
    @PreUpdate
    protected void onUpdate(){
        if ("PENDING".equals(status)) {
            calculateTotalPrice();
        }
    }

    // Takes the OrderItem snapshot of the current products (once).
    public void snapshotItems() {
        if (!items.isEmpty()) return;
        for (Product product : products) {
            items.add(OrderItem.snapshotOf(this, product));
        }
    }

    // Names of what's in the order: the snapshot for a past order, the live
    // products for a cart.
    public List<String> lineNames() {
        if (!"PENDING".equals(status) && !items.isEmpty()) {
            return items.stream().map(OrderItem::getName).collect(Collectors.toList());
        }
        return products.stream().map(Product::getName).collect(Collectors.toList());
    }

    public void calculateTotalPrice(){
        double sum = products.stream()
                .mapToDouble(Product::getDiscountedPrice)
                .sum();
        this.totalPrice = Math.round(sum * 100) / 100.0;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }
}
