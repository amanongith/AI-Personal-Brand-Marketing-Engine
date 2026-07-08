package com.personalbrand.repository;

import com.personalbrand.entity.Content;
import com.personalbrand.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {
    List<Content> findByUser(User user);

    List<Content> findByUserId(Long userId);

    List<Content> findByUserIdAndStatus(Long userId, String status);

    List<Content> findByStatus(String status);

    List<Content> findByUserIdAndPlatform(Long userId, String platform);

    List<Content> findByUserIdAndStatusAndPublishedTimeIsNull(Long userId, String status);

    List<Content> findByUserIdAndScheduledTimeBetween(Long userId, LocalDateTime start, LocalDateTime end);

    long countByUserIdAndStatus(Long userId, String status);
}

