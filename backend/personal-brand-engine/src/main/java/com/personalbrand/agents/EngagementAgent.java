package com.personalbrand.agents;

import com.personalbrand.repository.EngagementRepository;
import org.springframework.stereotype.Component;

@Component
public class EngagementAgent {

    private final EngagementRepository engagementRepository;

    public EngagementAgent(EngagementRepository engagementRepository) {
        this.engagementRepository = engagementRepository;
    }

    public String trackEngagement(Long userId) {
        var engagements = engagementRepository.findByUserId(userId);
        long totalEngagement = engagements.stream()
                .mapToLong(e -> e.getEngagementCount() != null ? e.getEngagementCount() : 0)
                .sum();
        return String.format("Total engagement: %d interactions", totalEngagement);
    }

    public String analyzeEngagementTrends(Long userId) {
        var engagements = engagementRepository.findByUserId(userId);
        return String.format("Analyzed %d engagement records for trends", engagements.size());
    }
}
