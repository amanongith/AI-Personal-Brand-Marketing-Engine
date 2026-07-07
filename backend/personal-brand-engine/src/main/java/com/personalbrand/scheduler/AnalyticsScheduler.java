package com.personalbrand.scheduler;

import com.personalbrand.repository.AnalyticsRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AnalyticsScheduler {

    private final AnalyticsRepository analyticsRepository;

    public AnalyticsScheduler(AnalyticsRepository analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    @Scheduled(cron = "0 0 * * * *") // Every hour
    public void updateAnalytics() {
        // Fetch latest analytics from social media platforms
        // Update the database with new metrics
        var allAnalytics = analyticsRepository.findAll();
        allAnalytics.forEach(analytics -> {
            analytics.setUpdatedAt(LocalDateTime.now());
            analyticsRepository.save(analytics);
        });
    }
}
