package com.trustfix.dto.booking;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class BookingRequest {

    @NotNull(message = "Booking date is required")
    private LocalDate bookingDate;

    @NotNull(message = "Booking time is required")
    private LocalTime bookingTime;

    @DecimalMin(value = "0.0", message = "Total amount must be greater than or equal to 0")
    private BigDecimal totalAmount;

    private String notes;
    private String cancellationReason;

    public BookingRequest() {
    }

    public BookingRequest(LocalDate bookingDate, LocalTime bookingTime, BigDecimal totalAmount, String notes) {
        this.bookingDate = bookingDate;
        this.bookingTime = bookingTime;
        this.totalAmount = totalAmount;
        this.notes = notes;
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
}
