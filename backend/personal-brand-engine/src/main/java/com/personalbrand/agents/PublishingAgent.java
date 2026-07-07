package com.personalbrand.agents;

import com.personalbrand.repository.ContentRepository;
import org.springframework.stereotype.Component;

@Component
public class PublishingAgent {

    private final ContentRepository contentRepository;

    public PublishingAgent(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    public String publishContent(Long contentId) {
        return contentRepository.findById(contentId)
                .map(content -> {
                    // Integration with platform APIs for publishing
                    return String.format("Publishing content '%s' to %s", content.getTitle(), content.getPlatform());
                })
                .orElse("Content not found");
    }

    public String schedulePublishing(Long contentId, String scheduledTime) {
        return contentRepository.findById(contentId)
                .map(content -> String.format("Scheduled '%s' for %s", content.getTitle(), scheduledTime))
                .orElse("Content not found");
    }
}
