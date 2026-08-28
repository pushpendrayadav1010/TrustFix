package com.trustfix.dto.mapper;

import com.trustfix.dto.providerservice.ProviderServiceResponse;
import com.trustfix.entity.ProviderService;
import org.springframework.stereotype.Component;

@Component
public class ProviderServiceMapper {

    public ProviderServiceResponse toResponse(ProviderService providerService) {
        if (providerService == null) {
            return null;
        }
        return new ProviderServiceResponse(
                providerService.getId(),
                providerService.getProvider() != null ? providerService.getProvider().getId() : null,
                providerService.getProvider() != null ? providerService.getProvider().getBusinessName() : null,
                providerService.getService() != null ? providerService.getService().getId() : null,
                providerService.getService() != null ? providerService.getService().getName() : null,
                providerService.getService() != null ? providerService.getService().getBasePrice() : null,
                providerService.getCustomPrice(),
                providerService.isAvailable(),
                providerService.getCreatedAt(),
                providerService.getUpdatedAt()
        );
    }
}
