package com.trainguard.backend.userActions;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAgreementRepository extends JpaRepository<UserAgreementsEntity, Long> {
}
