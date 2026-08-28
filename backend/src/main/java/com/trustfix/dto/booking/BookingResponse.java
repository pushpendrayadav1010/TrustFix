package com.trustfix.dto.booking;

import com.trustfix.entity.BookingStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class BookingResponse {

    private Long id;
    private String bookingReference;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private Long providerId;
    private String providerBusinessName;
    private Long serviceId;
    private String serviceName;
    private Long addressId;
    private String addressLine1;
    private String city;
    private String postalCode;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private BookingStatus status;
    private BigDecimal totalAmount;
    private String notes;
    private String cancellationReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BookingResponse() {
    }

    public BookingResponse(Long id, String bookingReference, Long customerId, String customerName, String customerEmail, String customerPhone, Long providerId, String providerBusinessName, Long serviceId, String serviceName, Long addressId, String addressLine1, String city, String postalCode, LocalDate bookingDate, LocalTime bookingTime, BookingStatus status, BigDecimal totalAmount, String notes, String cancellationReason, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.bookingReference = bookingReference;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.providerId = providerId;
        this.providerBusinessName = providerBusinessName;
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.addressId = addressId;
        this.addressLine1 = addressLine1;
        this.city = city;
        this.postalCode = postalCode;
        this.bookingDate = bookingDate;
        this.bookingTime = bookingTime;
        this.status = status;
        this.totalAmount = totalAmount;
        this.notes = notes;
        this.cancellationReason = cancellationReason;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
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

    public Long getAddressId() {
        return addressId;
    }

    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }

    public String getAddressLine1() {
        return addressLine1;
    }

    public void setAddressLine1(String addressLine1) {
        this.addressLine1 = addressLine1;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public LocalTime getBookingTime() {
        return bookingTime;
    }

    public void setBookingTime(LocalTime bookingTime) {
        this.bookingTime = bookingTime;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
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
