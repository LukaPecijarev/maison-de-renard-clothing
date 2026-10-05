package com.example.maisonderenard.repository;

import com.example.maisonderenard.model.domain.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // The product was deleted: past order lines keep their snapshot but no
    // longer link to it.
    @Modifying
    @Query("update OrderItem i set i.productId = null where i.productId = :productId")
    int unlinkProduct(@Param("productId") Long productId);
}
