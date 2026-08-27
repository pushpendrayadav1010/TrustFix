package com.trustfix.dto.mapper;

import com.trustfix.dto.booking.BookingRequest;
import com.trustfix.dto.booking.BookingResponse;
import com.trustfix.entity.Booking;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    public Booking toEntity(BookingRequest request) {
        if (request == null) {
            return null;
        }
        Booking booking = new Booking();
        booking.setBookingDate(request.getBookingDate());
        booking.setBookingTime(request.getBookingTime());
        booking.setTotalAmount(request.getTotalAmount());
        booking.setNotes(request.getNotes());
        booking.setCancellationReason(request.getCancellationReason());
        return booking;
    }

    public BookingResponse toResponse(Booking booking) {
        if (booking == null) {
            return null;
        }
        return new BookingResponse(
                booking.getId(),
                booking.getBookingReference(),
                booking.getCustomer() != null ? booking.getCustomer().getId() : null,
                booking.getCustomer() != null ? booking.getCustomer().getName() : null,
                booking.getCustomer() != null ? booking.getCustomer().getEmail() : null,
                booking.getCustomer() != null ? booking.getCustomer().getPhone() : null,
                booking.getProvider() != null ? booking.getProvider().getId() : null,
                booking.getProvider() != null ? booking.getProvider().getBusinessName() : null,
                booking.getService() != null ? booking.getService().getId() : null,
                booking.getService() != null ? booking.getService().getName() : null,
                booking.getAddress() != null ? booking.getAddress().getId() : null,
                booking.getAddress() != null ? booking.getAddress().getAddressLine1() : null,
                booking.getAddress() != null ? booking.getAddress().getCity() : null,
                booking.getAddress() != null ? booking.getAddress().getPostalCode() : null,
                booking.getBookingDate(),
                booking.getBookingTime(),
                booking.getStatus(),
                booking.getTotalAmount(),
                booking.getNotes(),
                booking.getCancellationReason(),
                booking.getCreatedAt(),
                booking.getUpdatedAt()
        );
    }
}
