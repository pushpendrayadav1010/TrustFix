package com.trustfix.service;

import com.trustfix.entity.Address;
import com.trustfix.entity.Booking;
import com.trustfix.entity.BookingStatus;
import com.trustfix.entity.ProviderProfile;
import com.trustfix.entity.Service;
import com.trustfix.entity.User;
import com.trustfix.exception.BadRequestException;
import com.trustfix.exception.ResourceNotFoundException;
import com.trustfix.repository.AddressRepository;
import com.trustfix.repository.BookingRepository;
import com.trustfix.repository.ProviderProfileRepository;
import com.trustfix.repository.ServiceRepository;
import com.trustfix.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@org.springframework.stereotype.Service
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final ServiceRepository serviceRepository;
    private final AddressRepository addressRepository;

    public BookingService(BookingRepository bookingRepository,
                          UserRepository userRepository,
                          ProviderProfileRepository providerProfileRepository,
                          ServiceRepository serviceRepository,
                          AddressRepository addressRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.serviceRepository = serviceRepository;
        this.addressRepository = addressRepository;
    }

    public Booking createBooking(Long customerId, Long serviceId, Long addressId, Long providerId, Booking booking) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + serviceId));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + addressId));

        if (!address.getUser().getId().equals(customerId)) {
            throw new BadRequestException("Selected address does not belong to customer ID: " + customerId);
        }

        if (providerId != null) {
            ProviderProfile provider = providerProfileRepository.findById(providerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Provider not found with ID: " + providerId));
            booking.setProvider(provider);
        }

        booking.setCustomer(customer);
        booking.setService(service);
        booking.setAddress(address);

        if (booking.getTotalAmount() == null) {
            booking.setTotalAmount(service.getBasePrice());
        }

        if (booking.getStatus() == null) {
            booking.setStatus(BookingStatus.PENDING);
        }

        return bookingRepository.save(booking);
    }

    @Transactional(readOnly = true)
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public Booking getBookingByReference(String bookingReference) {
        return bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with reference: " + bookingReference));
    }

    @Transactional(readOnly = true)
    public List<Booking> getBookingsByCustomer(Long customerId) {
        if (!userRepository.existsById(customerId)) {
            throw new ResourceNotFoundException("Customer not found with ID: " + customerId);
        }
        return bookingRepository.findByCustomerId(customerId);
    }

    @Transactional(readOnly = true)
    public List<Booking> getBookingsByProvider(Long providerId) {
        if (!providerProfileRepository.existsById(providerId)) {
            throw new ResourceNotFoundException("Provider profile not found with ID: " + providerId);
        }
        return bookingRepository.findByProviderId(providerId);
    }

    @Transactional(readOnly = true)
    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    public Booking updateBookingStatus(Long bookingId, BookingStatus newStatus) {
        Booking booking = getBookingById(bookingId);
        BookingStatus currentStatus = booking.getStatus();

        if (currentStatus == BookingStatus.COMPLETED || currentStatus == BookingStatus.CANCELLED) {
            throw new BadRequestException("Cannot update status of a booking that is already " + currentStatus);
        }

        if (newStatus == BookingStatus.CANCELLED && booking.getCancellationReason() == null) {
            booking.setCancellationReason("Cancelled by user/admin");
        }

        booking.setStatus(newStatus);
        return bookingRepository.save(booking);
    }

    public Booking assignProvider(Long bookingId, Long providerId) {
        Booking booking = getBookingById(bookingId);
        ProviderProfile provider = providerProfileRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found with ID: " + providerId));

        booking.setProvider(provider);
        if (booking.getStatus() == BookingStatus.PENDING) {
            booking.setStatus(BookingStatus.CONFIRMED);
        }

        return bookingRepository.save(booking);
    }
}
