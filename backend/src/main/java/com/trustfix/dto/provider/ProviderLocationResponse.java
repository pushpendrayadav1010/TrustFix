package com.trustfix.dto.provider;

public class ProviderLocationResponse {

    private Long providerId;
    private String businessName;
    private Double rating;
    private Integer reviewCount;
    private Double latitude;
    private Double longitude;
    private Double serviceRadiusKm;
    private Double distanceKm;
    private boolean available;

    public ProviderLocationResponse() {
    }

    public ProviderLocationResponse(Long providerId, String businessName, Double rating, Integer reviewCount, Double latitude, Double longitude, Double serviceRadiusKm, Double distanceKm, boolean available) {
        this.providerId = providerId;
        this.businessName = businessName;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.latitude = latitude;
        this.longitude = longitude;
        this.serviceRadiusKm = serviceRadiusKm;
        this.distanceKm = distanceKm;
        this.available = available;
    }

    public Long getProviderId() {
        return providerId;
    }

    public void setProviderId(Long providerId) {
        this.providerId = providerId;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
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

    public Double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
}
