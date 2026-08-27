package com.trustfix.dto.provider;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class ProviderProfileRequest {

    @Size(max = 150, message = "Business name cannot exceed 150 characters")
    private String businessName;

    private String bio;

    @Min(value = 0, message = "Experience years cannot be negative")
    private Integer experienceYears = 0;

    @Size(max = 255, message = "Document URL cannot exceed 255 characters")
    private String documentUrl;

    private Double latitude;
    private Double longitude;

    @Min(value = 0, message = "Service radius cannot be negative")
    private Double serviceRadiusKm = 25.0;

    @Size(max = 100, message = "City cannot exceed 100 characters")
    private String city;

    @Size(max = 100, message = "State cannot exceed 100 characters")
    private String state;

    @Size(max = 20, message = "Postal code cannot exceed 20 characters")
    private String postalCode;

    private boolean available = true;

    public ProviderProfileRequest() {
    }

    public ProviderProfileRequest(String businessName, String bio, Integer experienceYears, String documentUrl) {
        this.businessName = businessName;
        this.bio = bio;
        this.experienceYears = experienceYears;
        this.documentUrl = documentUrl;
    }

    public ProviderProfileRequest(String businessName, String bio, Integer experienceYears, String documentUrl, Double latitude, Double longitude, Double serviceRadiusKm, String city, String state, String postalCode, boolean available) {
        this.businessName = businessName;
        this.bio = bio;
        this.experienceYears = experienceYears;
        this.documentUrl = documentUrl;
        this.latitude = latitude;
        this.longitude = longitude;
        this.serviceRadiusKm = serviceRadiusKm;
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
        this.available = available;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getDocumentUrl() {
        return documentUrl;
    }

    public void setDocumentUrl(String documentUrl) {
        this.documentUrl = documentUrl;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getServiceRadiusKm() {
        return serviceRadiusKm;
    }

    public void setServiceRadiusKm(Double serviceRadiusKm) {
        this.serviceRadiusKm = serviceRadiusKm;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
}
