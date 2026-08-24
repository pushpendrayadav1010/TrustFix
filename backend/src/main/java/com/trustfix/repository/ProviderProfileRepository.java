package com.trustfix.repository;

import com.trustfix.entity.ProviderProfile;
import com.trustfix.entity.User;
import com.trustfix.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderProfileRepository extends JpaRepository<ProviderProfile, Long> {

    Optional<ProviderProfile> findByUser(User user);

    Optional<ProviderProfile> findByUserId(Long userId);

    List<ProviderProfile> findByVerificationStatus(VerificationStatus status);

    List<ProviderProfile> findByAvailableTrue();

    List<ProviderProfile> findByVerificationStatusAndAvailableTrue(VerificationStatus status);
}
