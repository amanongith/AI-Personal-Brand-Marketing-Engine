package com.personalbrand.service;

import com.personalbrand.dto.response.DashboardResponse;
import com.personalbrand.repository.AnalyticsRepository;
import com.personalbrand.repository.ContentRepository;
import com.personalbrand.repository.EngagementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final ContentRepository contentRepository;
    private final AnalyticsRepository analyticsRepository;
    private final EngagementRepository engagementRepository;
    private final AnalyticsService analyticsService;

    public DashboardResponse getDashboardData(Long userId) {
        long totalPosts = contentRepository.countByUserIdAndStatus(userId, "PUBLISHED");
        long upcomingPosts = contentRepository.countByUserIdAndStatus(userId, "SCHEDULED");
        long draftPosts = contentRepository.countByUserIdAndStatus(userId, "DRAFT");

        long totalEngagement = engagementRepository.findByUserId(userId).stream()
                .mapToLong(e -> e.getEngagementCount() != null ? e.getEngagementCount() : 0)
                .sum();

        long followers = analyticsRepository.findByUserIdOrderByMetricsDateDesc(userId).stream()
                .findFirst()
                .map(a -> a.getFollowers() != null ? a.getFollowers() : 0L)
                .orElse(0L);

        double engagementRate = analyticsRepository.findByUserIdOrderByMetricsDateDesc(userId).stream()
                .findFirst()
                .map(a -> a.getEngagementRate() != null ? a.getEngagementRate() : 0.0)
                .orElse(0.0);

        double brandScore = analyticsService.calculateBrandScore(userId);

        return DashboardResponse.builder()
                .totalPosts(totalPosts)
                .upcomingPosts(upcomingPosts)
                .draftPosts(draftPosts)
                .totalEngagement(totalEngagement)
                .followers(followers)
                .engagementRate(engagementRate)
                .brandScore(brandScore)
                .build();
    }
}
