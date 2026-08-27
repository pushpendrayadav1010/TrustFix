package com.trustfix.dto.providerservice;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProviderServiceResponse {

    private Long id;
    private Long providerId;
    private String providerBusinessName;
    private Long serviceId;
    private String serviceName;
    private BigDecimal basePrice;
    private BigDecimal customPrice;
    private boolean available;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProviderServiceResponse() {
    }

    public ProviderServiceResponse(Long id, Long providerId, String providerBusinessName, Long serviceId, String serviceName, BigDecimal basePrice, BigDecimal customPrice, boolean available, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.providerId = providerId;
        this.providerBusinessName = providerBusinessName;
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.basePrice = basePrice;
        this.customPrice = customPrice;
        this.available = available;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProviderId() {
        return providerId;
    }

    public void setProviderId(Long providerId) {
        this.providerId = providerId;
    }

    public String getProviderBusinessName() {
        return providerBusinessName;
    }

    public void setProviderBusinessName(String providerBusinessName) {
        this.providerBusinessName = providerBusinessName;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public BigDecimal getCustomPrice() {
        return customPrice;
    }

    public void setCustomPrice(BigDecimal customPrice) {
        this.customPrice = customPrice;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
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
