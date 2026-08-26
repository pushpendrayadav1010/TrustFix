package com.trustfix.controller;

import com.trustfix.entity.ProviderService;
import com.trustfix.service.ProviderServiceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/provider-services")
public class ProviderServiceController {

    private final ProviderServiceService providerServiceService;

    public ProviderServiceController(ProviderServiceService providerServiceService) {
        this.providerServiceService = providerServiceService;
    }

    @PostMapping("/provider/{providerId}/service/{serviceId}")
    public ResponseEntity<ProviderService> addServiceToProvider(
            @PathVariable Long providerId,
            @PathVariable Long serviceId,
            @RequestParam(required = false) BigDecimal customPrice) {
        ProviderService createdProviderService = providerServiceService.addServiceToProvider(providerId, serviceId, customPrice);
        return new ResponseEntity<>(createdProviderService, HttpStatus.CREATED);
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ProviderService>> getServicesForProvider(@PathVariable Long providerId) {
        List<ProviderService> services = providerServiceService.getServicesForProvider(providerId);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<ProviderService>> getProvidersForService(@PathVariable Long serviceId) {
        List<ProviderService> providers = providerServiceService.getProvidersForService(serviceId);
        return ResponseEntity.ok(providers);
    }

    @PutMapping("/provider/{providerId}/service/{serviceId}/price")
    public ResponseEntity<ProviderService> updateCustomPrice(
            @PathVariable Long providerId,
            @PathVariable Long serviceId,
            @RequestParam BigDecimal customPrice) {
        ProviderService updatedProviderService = providerServiceService.updateCustomPrice(providerId, serviceId, customPrice);
        return ResponseEntity.ok(updatedProviderService);
    }

    @DeleteMapping("/provider/{providerId}/service/{serviceId}")
    public ResponseEntity<Void> removeServiceFromProvider(
            @PathVariable Long providerId,
            @PathVariable Long serviceId) {
        providerServiceService.removeServiceFromProvider(providerId, serviceId);
        return ResponseEntity.noContent().build();
    }
}
