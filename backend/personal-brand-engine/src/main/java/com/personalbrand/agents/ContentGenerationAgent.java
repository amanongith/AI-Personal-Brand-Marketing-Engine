package com.personalbrand.agents;

import com.personalbrand.ai.client.OpenAIClient;
import com.personalbrand.ai.prompts.LinkedInPrompt;
import com.personalbrand.repository.ProfileRepository;
import org.springframework.stereotype.Component;

@Component
public class ContentGenerationAgent {

    private final OpenAIClient openAIClient;
    private final ProfileRepository profileRepository;

    public ContentGenerationAgent(OpenAIClient openAIClient, ProfileRepository profileRepository) {
        this.openAIClient = openAIClient;
        this.profileRepository = profileRepository;
    }

    public String generateContent(Long userId, String platform, String topic) {
        return profileRepository.findByUserId(userId)
                .map(profile -> {
                    String prompt = LinkedInPrompt.generatePostPrompt(topic, "professional", profile.getNiche());
                    return openAIClient.generateCompletion(prompt);
                })
                .orElse("User profile not found");
    }

    public String generateMultiplePosts(Long userId, String platform, int count) {
        return String.format("Generated %d posts for %s", count, platform);
    }
}
