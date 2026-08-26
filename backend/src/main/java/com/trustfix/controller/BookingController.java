package com.trustfix.controller;

import com.trustfix.entity.Booking;
import com.trustfix.entity.BookingStatus;
import com.trustfix.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestParam Long customerId,
            @RequestParam Long serviceId,
            @RequestParam Long addressId,
            @RequestParam(required = false) Long providerId,
            @Valid @RequestBody(required = false) Booking booking) {
        Booking bookingToCreate = booking != null ? booking : new Booking();
        Booking createdBooking = bookingService.createBooking(customerId, serviceId, addressId, providerId, bookingToCreate);
        return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/reference/{bookingReference}")
    public ResponseEntity<Booking> getBookingByReference(@PathVariable String bookingReference) {
        Booking booking = bookingService.getBookingByReference(bookingReference);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Booking>> getBookingsByCustomer(@PathVariable Long customerId) {
        List<Booking> bookings = bookingService.getBookingsByCustomer(customerId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Booking>> getBookingsByProvider(@PathVariable Long providerId) {
        List<Booking> bookings = bookingService.getBookingsByProvider(providerId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Booking>> getBookingsByStatus(@PathVariable BookingStatus status) {
        List<Booking> bookings = bookingService.getBookingsByStatus(status);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status) {
        Booking updatedBooking = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok(updatedBooking);
    }

    @PutMapping("/{id}/assign-provider")
    public ResponseEntity<Booking> assignProvider(
            @PathVariable Long id,
            @RequestParam Long providerId) {
        Booking updatedBooking = bookingService.assignProvider(id, providerId);
        return ResponseEntity.ok(updatedBooking);
    }

    @PutMapping("/{id}/provider/{providerId}")
    public ResponseEntity<Booking> assignProviderByPath(
            @PathVariable Long id,
            @PathVariable Long providerId) {
        Booking updatedBooking = bookingService.assignProvider(id, providerId);
        return ResponseEntity.ok(updatedBooking);
    }
}
