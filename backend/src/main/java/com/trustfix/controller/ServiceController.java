package com.trustfix.controller;

import com.trustfix.entity.Service;
import com.trustfix.service.ServiceCatalogService;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceCatalogService serviceCatalogService;

    public ServiceController(ServiceCatalogService serviceCatalogService) {
        this.serviceCatalogService = serviceCatalogService;
    }

    @PostMapping("/category/{categoryId}")
    public ResponseEntity<Service> createService(
            @PathVariable Long categoryId,
            @Valid @RequestBody Service service) {
        Service createdService = serviceCatalogService.createService(categoryId, service);
        return new ResponseEntity<>(createdService, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Service>> getAllServices() {
        List<Service> services = serviceCatalogService.getAllServices();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Service>> getActiveServices() {
        List<Service> services = serviceCatalogService.getActiveServices();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {
        Service service = serviceCatalogService.getServiceById(id);
        return ResponseEntity.ok(service);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Service>> getServicesByCategoryId(@PathVariable Long categoryId) {
        List<Service> services = serviceCatalogService.getServicesByCategoryId(categoryId);
        return ResponseEntity.ok(services);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(
            @PathVariable Long id,
            @RequestBody Service updatedService) {
        Service service = serviceCatalogService.updateService(id, updatedService);
        return ResponseEntity.ok(service);
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateService(@PathVariable Long id) {
        serviceCatalogService.deactivateService(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceCatalogService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}
