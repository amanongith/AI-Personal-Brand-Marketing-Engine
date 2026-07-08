package com.personalbrand.scheduler;

import com.personalbrand.repository.ContentRepository;
import com.personalbrand.service.SocialMediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class PostScheduler {

    private final ContentRepository contentRepository;
    private final SocialMediaService socialMediaService;

    @Scheduled(fixedRate = 60000) // Every 1 minute
    public void processScheduledPosts() {
        LocalDateTime now = LocalDateTime.now();
        var scheduledContent = contentRepository.findByStatus("SCHEDULED");

        scheduledContent.stream()
                .filter(content -> content.getScheduledTime() != null &&
                        content.getScheduledTime().isBefore(now))
                .forEach(content -> {
                    socialMediaService.publishPost(content.getId());
                });
    }
}
