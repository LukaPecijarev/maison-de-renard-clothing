package com.example.maisonderenard.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

// Enables the @Cacheable/@CacheEvict annotations used on ProductService/CategoryService.
// Uses Spring's default in-memory ConcurrentMapCacheManager - fine for a single-instance
// app; the catalog is read far more often than it's written, so caching findAll() cuts
// out a lot of repeat DB round-trips.
@Configuration
@EnableCaching
public class CacheConfig {
}
