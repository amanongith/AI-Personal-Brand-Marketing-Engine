package com.personalbrand.service;

import com.personalbrand.entity.Content;
import com.personalbrand.entity.Engagement;
import com.personalbrand.repository.ContentRepository;
import com.personalbrand.repository.EngagementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EngagementService {

    private final EngagementRepository engagementRepository;
    private final ContentRepository contentRepository;

    public List<Engagement> getUserEngagement(Long userId) {
        return engagementRepository.findByUserId(userId);
    }

    public List<Engagement> getContentEngagement(Long contentId) {
        return engagementRepository.findByContentId(contentId);
    }

    public Engagement recordEngagement(Engagement engagement) {
        Content content = contentRepository.findById(engagement.getContent().getId()).orElse(null);
        if (content != null) {
            engagement.setContent(content);
            engagement.setUser(content.getUser());
            engagement.setEngagementDate(LocalDateTime.now());
        }
        return engagementRepository.save(engagement);
    }

    public Long calculateTotalEngagements(Long contentId) {
        return engagementRepository.findByContentId(contentId).stream()
                .mapToLong(e -> e.getEngagementCount() != null ? e.getEngagementCount() : 0)
                .sum();
    }

    public Double predictEngagementScore(Long contentId) {
        Long total = calculateTotalEngagements(contentId);
        Content content = contentRepository.findById(contentId).orElse(null);

        if (content == null) return 0.0;

        long daysOld = java.time.temporal.ChronoUnit.DAYS.between(content.getCreatedAt(), LocalDateTime.now());
        double ageMultiplier = daysOld > 0 ? 1.0 / (1.0 + (daysOld / 7.0)) : 1.0;

        double score = (total * ageMultiplier) / 100.0;
        return Math.min(score * 100, 100.0);
    }
}
