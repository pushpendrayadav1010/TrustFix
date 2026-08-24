package com.trustfix.service;

import com.trustfix.entity.ProviderProfile;
import com.trustfix.entity.User;
import com.trustfix.entity.UserRole;
import com.trustfix.entity.VerificationStatus;
import com.trustfix.exception.BadRequestException;
import com.trustfix.exception.ResourceAlreadyExistsException;
import com.trustfix.exception.ResourceNotFoundException;
import com.trustfix.repository.ProviderProfileRepository;
import com.trustfix.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProviderProfileService {

    private final ProviderProfileRepository providerProfileRepository;
    private final UserRepository userRepository;

    public ProviderProfileService(ProviderProfileRepository providerProfileRepository, UserRepository userRepository) {
        this.providerProfileRepository = providerProfileRepository;
        this.userRepository = userRepository;
    }

    public ProviderProfile createProviderProfile(Long userId, ProviderProfile profile) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (providerProfileRepository.findByUserId(userId).isPresent()) {
            throw new ResourceAlreadyExistsException("Provider profile already exists for user ID: " + userId);
        }

        if (user.getRole() != UserRole.PROVIDER) {
            user.setRole(UserRole.PROVIDER);
            userRepository.save(user);
        }

        profile.setUser(user);
        if (profile.getVerificationStatus() == null) {
            profile.setVerificationStatus(VerificationStatus.PENDING);
        }
        return providerProfileRepository.save(profile);
    }

    @Transactional(readOnly = true)
    public ProviderProfile getProviderById(Long id) {
        return providerProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public ProviderProfile getProviderByUserId(Long userId) {
        return providerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found for user ID: " + userId));
    }

    @Transactional(readOnly = true)
    public List<ProviderProfile> getVerifiedProviders() {
        return providerProfileRepository.findByVerificationStatus(VerificationStatus.VERIFIED);
    }

    @Transactional(readOnly = true)
    public List<ProviderProfile> getAvailableVerifiedProviders() {
        return providerProfileRepository.findByVerificationStatusAndAvailableTrue(VerificationStatus.VERIFIED);
    }

    public ProviderProfile updateProviderProfile(Long providerId, ProviderProfile updatedDetails) {
        ProviderProfile existingProfile = getProviderById(providerId);

        if (updatedDetails.getBusinessName() != null) {
            existingProfile.setBusinessName(updatedDetails.getBusinessName());
        }
        if (updatedDetails.getBio() != null) {
            existingProfile.setBio(updatedDetails.getBio());
        }
        if (updatedDetails.getExperienceYears() != null) {
            existingProfile.setExperienceYears(updatedDetails.getExperienceYears());
        }
        if (updatedDetails.getDocumentUrl() != null) {
            existingProfile.setDocumentUrl(updatedDetails.getDocumentUrl());
        }
        existingProfile.setAvailable(updatedDetails.isAvailable());

        return providerProfileRepository.save(existingProfile);
    }

    public ProviderProfile updateVerificationStatus(Long providerId, VerificationStatus status) {
        if (status == null) {
            throw new BadRequestException("Verification status cannot be null");
        }
        ProviderProfile profile = getProviderById(providerId);
        profile.setVerificationStatus(status);
        return providerProfileRepository.save(profile);
    }
}
