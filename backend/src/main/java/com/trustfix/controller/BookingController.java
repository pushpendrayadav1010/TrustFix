package com.trustfix.controller;

import com.trustfix.dto.booking.BookingRequest;
import com.trustfix.dto.booking.BookingResponse;
import com.trustfix.dto.mapper.BookingMapper;
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
    private final BookingMapper bookingMapper;

    public BookingController(BookingService bookingService, BookingMapper bookingMapper) {
        this.bookingService = bookingService;
        this.bookingMapper = bookingMapper;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @RequestParam Long customerId,
            @RequestParam Long serviceId,
            @RequestParam Long addressId,
            @RequestParam(required = false) Long providerId,
            @Valid @RequestBody(required = false) BookingRequest request) {
        Booking bookingToCreate = bookingMapper.toEntity(request);
        if (bookingToCreate == null) {
            bookingToCreate = new Booking();
        }
        Booking createdBooking = bookingService.createBooking(customerId, serviceId, addressId, providerId, bookingToCreate);
        return new ResponseEntity<>(bookingMapper.toResponse(createdBooking), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(bookingMapper.toResponse(booking));
    }

    @GetMapping("/reference/{bookingReference}")
    public ResponseEntity<BookingResponse> getBookingByReference(@PathVariable String bookingReference) {
        Booking booking = bookingService.getBookingByReference(bookingReference);
        return ResponseEntity.ok(bookingMapper.toResponse(booking));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByCustomer(@PathVariable Long customerId) {
        List<BookingResponse> bookings = bookingService.getBookingsByCustomer(customerId)
                .stream()
                .map(bookingMapper::toResponse)
                .toList();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByProvider(@PathVariable Long providerId) {
        List<BookingResponse> bookings = bookingService.getBookingsByProvider(providerId)
                .stream()
                .map(bookingMapper::toResponse)
                .toList();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<BookingResponse>> getBookingsByStatus(@PathVariable BookingStatus status) {
        List<BookingResponse> bookings = bookingService.getBookingsByStatus(status)
                .stream()
                .map(bookingMapper::toResponse)
                .toList();
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status) {
        Booking updatedBooking = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok(bookingMapper.toResponse(updatedBooking));
    }

    @PutMapping("/{id}/assign-provider")
    public ResponseEntity<BookingResponse> assignProvider(
            @PathVariable Long id,
            @RequestParam Long providerId) {
        Booking updatedBooking = bookingService.assignProvider(id, providerId);
        return ResponseEntity.ok(bookingMapper.toResponse(updatedBooking));
    }

    @PutMapping("/{id}/provider/{providerId}")
    public ResponseEntity<BookingResponse> assignProviderByPath(
            @PathVariable Long id,
            @PathVariable Long providerId) {
        Booking updatedBooking = bookingService.assignProvider(id, providerId);
        return ResponseEntity.ok(bookingMapper.toResponse(updatedBooking));
    }
}
