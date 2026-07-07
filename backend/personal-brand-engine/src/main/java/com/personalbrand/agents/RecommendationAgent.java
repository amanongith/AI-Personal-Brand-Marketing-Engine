package com.personalbrand.agents;

import com.personalbrand.repository.SuggestionRepository;
import org.springframework.stereotype.Component;

@Component
public class RecommendationAgent {

    private final SuggestionRepository suggestionRepository;

    public RecommendationAgent(SuggestionRepository suggestionRepository) {
        this.suggestionRepository = suggestionRepository;
    }

    public String generateRecommendations(Long userId) {
        var suggestions = suggestionRepository.findByUserId(userId);
        return String.format("Generated %d personalized recommendations", suggestions.size());
    }

    public String optimizeStrategy(Long userId) {
        var suggestions = suggestionRepository.findByUserIdAndStatus(userId, "pending");
        return String.format("Optimization strategy with %d action items", suggestions.size());
    }
}
