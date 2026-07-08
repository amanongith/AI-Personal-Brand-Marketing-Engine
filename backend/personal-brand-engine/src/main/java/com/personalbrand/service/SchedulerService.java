package com.personalbrand.service;

import com.personalbrand.repository.ContentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SchedulerService {

    private final ContentRepository contentRepository;
    private final NotificationService notificationService;
    private final SocialMediaService socialMediaService;

    public void schedulePost(Long contentId, LocalDateTime scheduledTime) {
        contentRepository.findById(contentId).ifPresent(content -> {
            content.setScheduledTime(scheduledTime);
            content.setStatus("SCHEDULED");
            contentRepository.save(content);
            log.info("Post {} scheduled for {}", contentId, scheduledTime);
        });
    }

    public void reschedulePost(Long contentId, LocalDateTime newScheduledTime) {
        contentRepository.findById(contentId).ifPresent(content -> {
            content.setScheduledTime(newScheduledTime);
            contentRepository.save(content);
            log.info("Post {} rescheduled to {}", contentId, newScheduledTime);
        });
    }

    public void processScheduledPosts() {
        LocalDateTime now = LocalDateTime.now();
        contentRepository.findAll().stream()
                .filter(c -> "SCHEDULED".equals(c.getStatus()))
                .filter(c -> c.getScheduledTime() != null)
                .filter(c -> c.getScheduledTime().isBefore(now) || c.getScheduledTime().isEqual(now))
                .forEach(c -> {
                    socialMediaService.publishPost(c.getId());
                });
    }
}
