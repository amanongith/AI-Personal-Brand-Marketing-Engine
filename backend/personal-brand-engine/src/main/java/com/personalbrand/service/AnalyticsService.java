package com.personalbrand.service;

import com.personalbrand.entity.Analytics;
import com.personalbrand.entity.User;
import com.personalbrand.repository.AnalyticsRepository;
import com.personalbrand.repository.ContentRepository;
import com.personalbrand.repository.EngagementRepository;
import com.personalbrand.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final AnalyticsRepository analyticsRepository;
    private final UserRepository userRepository;
    private final ContentRepository contentRepository;
    private final EngagementRepository engagementRepository;

    public List<Analytics> getUserAnalytics(Long userId) {
        return analyticsRepository.findByUserId(userId);
    }

    public List<Analytics> getAnalyticsByPlatform(Long userId, String platform) {
        return analyticsRepository.findByUserIdAndPlatform(userId, platform);
    }

    public List<Analytics> getRecentAnalytics(Long userId) {
        return analyticsRepository.findByUserIdOrderByMetricsDateDesc(userId);
    }

    @Transactional
    public Analytics recordAnalytics(Analytics analytics) {
        User user = userRepository.findById(analytics.getUser().getId()).orElse(null);
        if (user != null) {
            analytics.setUser(user);
            analytics.setMetricsDate(LocalDateTime.now());
        }
        return analyticsRepository.save(analytics);
    }

    public Double calculateEngagementRate(Long contentId) {
        Long totalEngagements = engagementRepository.findByContentId(contentId).stream()
                .mapToLong(e -> e.getEngagementCount() != null ? e.getEngagementCount() : 0)
                .sum();

        return totalEngagements > 0 ? (double) totalEngagements : 0.0;
    }

    public Double calculateBrandScore(Long userId) {
        List<Analytics> userAnalytics = getUserAnalytics(userId);
        if (userAnalytics.isEmpty()) return 0.0;

        double totalScore = userAnalytics.stream()
                .mapToDouble(a -> a.getBrandScore() != null ? a.getBrandScore() : 0.0)
                .average()
                .orElse(0.0);

        return Math.min(totalScore, 100.0);
    }
}
