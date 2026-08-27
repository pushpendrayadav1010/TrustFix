package com.trustfix.dto.mapper;

import com.trustfix.dto.service.ServiceRequest;
import com.trustfix.dto.service.ServiceResponse;
import com.trustfix.entity.Service;
import org.springframework.stereotype.Component;

@Component
public class ServiceMapper {

    public Service toEntity(ServiceRequest request) {
        if (request == null) {
            return null;
        }
        Service service = new Service();
        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setBasePrice(request.getBasePrice());
        service.setDurationInMinutes(request.getDurationInMinutes());
        service.setImageUrl(request.getImageUrl());
        service.setActive(request.isActive());
        return service;
    }

    public ServiceResponse toResponse(Service service) {
        if (service == null) {
            return null;
        }
        return new ServiceResponse(
                service.getId(),
                service.getName(),
                service.getDescription(),
                service.getBasePrice(),
                service.getDurationInMinutes(),
                service.getCategory() != null ? service.getCategory().getId() : null,
                service.getCategory() != null ? service.getCategory().getName() : null,
                service.getImageUrl(),
                service.isActive(),
                service.getCreatedAt(),
                service.getUpdatedAt()
        );
    }
}
