package com.example.maisonderenard.model.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// A snapshot of one product line in a past (confirmed or cancelled) order -
// name, image and the price actually charged - taken when the order leaves the
// cart. Order history shows these instead of the live Product, so a product
// that's later edited or deleted still appears in past orders exactly as it was
// bought. (Same idea as SoldProduct, which snapshots sales for analytics.)
//
// productId points back at the product while it exists; it's set to null when
// the product is deleted.
@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column
    private Long productId;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String imageUrl;

    // What was charged for this line (the discounted price, if there was one).
    @Column(nullable = false)
    private Double price;

    @Column
    private String categoryName;

    @Column
    private String color;

    @Column
    private String size;

    public static OrderItem snapshotOf(Order order, Product product) {
        OrderItem item = new OrderItem();
        item.setOrder(order);
        item.setProductId(product.getId());
        item.setName(product.getName());
        item.setImageUrl(product.getImageUrl());
        item.setPrice(product.getDiscountedPrice());
        item.setCategoryName(product.getCategory() != null ? product.getCategory().getName() : null);
        item.setColor(product.getColor());
        item.setSize(product.getSize());
        return item;
    }
}
