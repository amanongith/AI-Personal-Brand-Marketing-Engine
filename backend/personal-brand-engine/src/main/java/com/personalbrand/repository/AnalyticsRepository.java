package com.personalbrand.repository;

import com.personalbrand.entity.Analytics;
import com.personalbrand.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnalyticsRepository extends JpaRepository<Analytics, Long> {
    List<Analytics> findByUser(User user);

    List<Analytics> findByUserId(Long userId);

    List<Analytics> findByUserIdAndPlatform(Long userId, String platform);

    List<Analytics> findByUserIdAndMetricsDateAfter(Long userId, LocalDateTime date);

    List<Analytics> findByUserIdOrderByMetricsDateDesc(Long userId);
}

