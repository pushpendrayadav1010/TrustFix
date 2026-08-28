package com.trustfix.dto.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ServiceResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal basePrice;
    private Integer durationInMinutes;
    private Long categoryId;
    private String categoryName;
    private String imageUrl;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ServiceResponse() {
    }

    public ServiceResponse(Long id, String name, String description, BigDecimal basePrice, Integer durationInMinutes, Long categoryId, String categoryName, String imageUrl, boolean active, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.basePrice = basePrice;
        this.durationInMinutes = durationInMinutes;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.imageUrl = imageUrl;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public Integer getDurationInMinutes() {
        return durationInMinutes;
    }

    public void setDurationInMinutes(Integer durationInMinutes) {
        this.durationInMinutes = durationInMinutes;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
