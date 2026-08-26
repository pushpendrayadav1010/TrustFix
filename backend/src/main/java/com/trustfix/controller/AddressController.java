package com.trustfix.controller;

import com.trustfix.entity.Address;
import com.trustfix.exception.ResourceNotFoundException;
import com.trustfix.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<Address> addAddress(
            @PathVariable Long userId,
            @Valid @RequestBody Address address) {
        Address createdAddress = addressService.addAddress(userId, address);
        return new ResponseEntity<>(createdAddress, HttpStatus.CREATED);
    }

    @PostMapping
    public ResponseEntity<Address> addAddressWithQueryParam(
            @RequestParam Long userId,
            @Valid @RequestBody Address address) {
        Address createdAddress = addressService.addAddress(userId, address);
        return new ResponseEntity<>(createdAddress, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Address>> getAddressesByUserId(@PathVariable Long userId) {
        List<Address> addresses = addressService.getAddressesByUserId(userId);
        return ResponseEntity.ok(addresses);
    }

    @GetMapping("/user/{userId}/default")
    public ResponseEntity<Address> getDefaultAddressByUserId(@PathVariable Long userId) {
        Address address = addressService.getDefaultAddressByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Default address not found for user ID: " + userId));
        return ResponseEntity.ok(address);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Address> getAddressById(@PathVariable Long id) {
        Address address = addressService.getAddressById(id);
        return ResponseEntity.ok(address);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(
            @PathVariable Long id,
            @RequestBody Address updatedAddress) {
        Address address = addressService.updateAddress(id, updatedAddress);
        return ResponseEntity.ok(address);
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<Address> setDefaultAddress(@PathVariable Long id) {
        Address update = new Address();
        update.setDefaultAddress(true);
        Address address = addressService.updateAddress(id, update);
        return ResponseEntity.ok(address);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }
}
