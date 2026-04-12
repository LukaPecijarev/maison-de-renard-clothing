package com.example.maisonderenard.repository;

import com.example.maisonderenard.model.domain.SoldProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface SoldProductRepository extends JpaRepository<SoldProduct, Long> {

    List<SoldProduct> findAllByOrderBySoldAtDesc();

    List<SoldProduct> findBySoldAtAfter(LocalDateTime date);
}