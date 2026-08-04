package com.trainguard.backend.userActions;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserAgreementRepository extends JpaRepository<UserAgreementsEntity, Long> {
    Optional<Long> findByStravaUser_AthleteId(java.lang.Long athleteId);
}
