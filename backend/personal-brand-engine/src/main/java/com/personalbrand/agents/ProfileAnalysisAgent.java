package com.personalbrand.agents;

import com.personalbrand.ai.client.OpenAIClient;
import com.personalbrand.ai.prompts.ProfileAnalysisPrompt;
import com.personalbrand.repository.ProfileRepository;
import org.springframework.stereotype.Component;

@Component
public class ProfileAnalysisAgent {

    private final OpenAIClient openAIClient;
    private final ProfileRepository profileRepository;

    public ProfileAnalysisAgent(OpenAIClient openAIClient, ProfileRepository profileRepository) {
        this.openAIClient = openAIClient;
        this.profileRepository = profileRepository;
    }

    public String analyzeProfile(Long userId) {
        return profileRepository.findByUserId(userId)
                .map(profile -> {
                    String prompt = ProfileAnalysisPrompt.generateBrandAnalysisPrompt(
                            profile.getBio(),
                            profile.getWebsite(),
                            profile.getNiche(),
                            profile.getTargetAudience()
                    );
                    return openAIClient.generateCompletion(prompt);
                })
                .orElse("Profile not found");
    }

    public String suggestImprovements(Long userId) {
        return profileRepository.findByUserId(userId)
                .map(profile -> {
                    String prompt = ProfileAnalysisPrompt.generateImprovementSuggestionsPrompt(
                            profile.getPersonalBrandStatement(),
                            profile.getNiche()
                    );
                    return openAIClient.generateCompletion(prompt);
                })
                .orElse("Profile not found");
    }
}
