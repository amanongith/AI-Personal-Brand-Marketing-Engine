package com.personalbrand.ai.prompts;

public class ProfileAnalysisPrompt {
    public static String generateBrandAnalysisPrompt(String bio, String website, String niche, String targetAudience) {
        return String.format(
                "Analyze this personal brand profile: Bio: %s, Website: %s, Niche: %s, Target Audience: %s. " +
                        "Provide insights on brand positioning, strengths, and areas for improvement.",
                bio, website, niche, targetAudience
        );
    }

    public static String generateImprovementSuggestionsPrompt(String currentBrand, String goals) {
        return String.format(
                "Generate 5 actionable improvement suggestions for this personal brand. " +
                        "Current Brand: %s. Goals: %s.",
                currentBrand, goals
        );
    }
}
