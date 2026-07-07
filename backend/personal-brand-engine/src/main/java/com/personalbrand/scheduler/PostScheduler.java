package com.personalbrand.scheduler;

import com.personalbrand.repository.ContentRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class PostScheduler {

    private final ContentRepository contentRepository;

    public PostScheduler(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    @Scheduled(fixedRate = 300000) // Every 5 minutes
    public void processScheduledPosts() {
        LocalDateTime now = LocalDateTime.now();
        var scheduledContent = contentRepository.findByUserIdAndStatus(1L, "SCHEDULED");

        scheduledContent.stream()
                .filter(content -> content.getScheduledTime() != null &&
                        content.getScheduledTime().isBefore(now))
                .forEach(content -> {
                    // Process and publish scheduled posts
                    content.setStatus("PUBLISHED");
                    content.setPublishedTime(now);
                    contentRepository.save(content);
                    
                    // Trigger real-time alert
                    String msg = String.format("Successfully published scheduled post: '%s' to %s", 
                            content.getTitle(), content.getPlatform());
                    com.personalbrand.security.NotificationWebSocketHandler.sendNotification("PUBLISH", msg);
                });
    }
}
