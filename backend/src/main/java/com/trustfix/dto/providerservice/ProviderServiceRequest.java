package com.trustfix.dto.providerservice;

import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;

public class ProviderServiceRequest {

    @DecimalMin(value = "0.0", message = "Custom price cannot be negative")
    private BigDecimal customPrice;

    private boolean available = true;

    public ProviderServiceRequest() {
    }

    public ProviderServiceRequest(BigDecimal customPrice, boolean available) {
        this.customPrice = customPrice;
        this.available = available;
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
}
