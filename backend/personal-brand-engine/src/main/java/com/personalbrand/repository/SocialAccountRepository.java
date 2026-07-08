package com.personalbrand.repository;

import com.personalbrand.entity.SocialAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SocialAccountRepository extends JpaRepository<SocialAccount, Long> {
    List<SocialAccount> findByUserId(Long userId);
    Optional<SocialAccount> findByUserIdAndPlatform(Long userId, String platform);
    boolean existsByUserIdAndPlatform(Long userId, String platform);
    void deleteByUserIdAndPlatform(Long userId, String platform);
}
