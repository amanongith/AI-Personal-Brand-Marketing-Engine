package com.personalbrand.repository;

import com.personalbrand.entity.Content;
import com.personalbrand.entity.Engagement;
import com.personalbrand.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EngagementRepository extends JpaRepository<Engagement, Long> {
    List<Engagement> findByUser(User user);

    List<Engagement> findByUserId(Long userId);

    List<Engagement> findByContent(Content content);

    List<Engagement> findByContentId(Long contentId);



    List<Engagement> findByUserIdAndPlatform(Long userId, String platform);

    List<Engagement> findByUserIdAndEngagementTypeAndEngagementDateAfter(Long userId, String type, LocalDateTime date);

    @Query(value = "SELECT SUM(e.engagement_count) FROM engagement e WHERE e.content_id = :contentId AND e.engagement_type = :type", nativeQuery = true)
    long sumByContentIdAndEngagementType(@Param("contentId") Long contentId, @Param("type") String type);
}