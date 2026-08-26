package com.trustfix.controller;

import com.trustfix.entity.ProviderProfile;
import com.trustfix.entity.ProviderService;
import com.trustfix.entity.Service;
import com.trustfix.exception.ResourceNotFoundException;
import com.trustfix.service.ProviderServiceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;

import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProviderServiceController.class)
class ProviderServiceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProviderServiceService providerServiceService;

    private ProviderService sampleProviderService;

    @BeforeEach
    void setUp() {
        ProviderProfile provider = new ProviderProfile();
        provider.setId(1L);

        Service service = new Service();
        service.setId(2L);
        service.setName("Plumbing Repair");
        service.setBasePrice(new BigDecimal("50.00"));

        sampleProviderService = new ProviderService(provider, service, new BigDecimal("60.00"));
        sampleProviderService.setId(10L);
    }

    @Test
    void addServiceToProvider_WithCustomPrice_Returns201() throws Exception {
        when(providerServiceService.addServiceToProvider(eq(1L), eq(2L), eq(new BigDecimal("60.00"))))
                .thenReturn(sampleProviderService);

        mockMvc.perform(post("/api/provider-services/provider/1/service/2")
                        .param("customPrice", "60.00"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.customPrice").value(60.00));
    }

    @Test
    void addServiceToProvider_WithoutCustomPrice_Returns201() throws Exception {
        when(providerServiceService.addServiceToProvider(eq(1L), eq(2L), isNull()))
                .thenReturn(sampleProviderService);

        mockMvc.perform(post("/api/provider-services/provider/1/service/2"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10));
    }

    @Test
    void getServicesForProvider_Success_Returns200() throws Exception {
        when(providerServiceService.getServicesForProvider(1L))
                .thenReturn(List.of(sampleProviderService));

        mockMvc.perform(get("/api/provider-services/provider/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(10));
    }

    @Test
    void getProvidersForService_Success_Returns200() throws Exception {
        when(providerServiceService.getProvidersForService(2L))
                .thenReturn(List.of(sampleProviderService));

        mockMvc.perform(get("/api/provider-services/service/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(10));
    }

    @Test
    void updateCustomPrice_Success_Returns200() throws Exception {
        when(providerServiceService.updateCustomPrice(eq(1L), eq(2L), eq(new BigDecimal("75.00"))))
                .thenReturn(sampleProviderService);

        mockMvc.perform(put("/api/provider-services/provider/1/service/2/price")
                        .param("customPrice", "75.00"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10));
    }

    @Test
    void removeServiceFromProvider_Success_Returns204() throws Exception {
        doNothing().when(providerServiceService).removeServiceFromProvider(1L, 2L);

        mockMvc.perform(delete("/api/provider-services/provider/1/service/2"))
                .andExpect(status().isNoContent());
    }

    @Test
    void getServicesForProvider_NotFound_Returns404() throws Exception {
        when(providerServiceService.getServicesForProvider(99L))
                .thenThrow(new ResourceNotFoundException("Provider profile not found with ID: 99"));

        mockMvc.perform(get("/api/provider-services/provider/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not Found"));
    }
}
