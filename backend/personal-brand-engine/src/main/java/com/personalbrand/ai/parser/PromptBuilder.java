package com.personalbrand.ai.parser;

import org.springframework.stereotype.Component;

@Component
public class PromptBuilder {

    public String buildSystemPrompt(String niche, String targetAudience) {
        return String.format(
                "You are an expert personal brand marketer specializing in the %s niche. " +
                        "Your target audience is %s. Create engaging, authentic, and professional content.",
                niche, targetAudience
        );
    }

    public String buildContextPrompt(String userBio, String goals) {
        return String.format(
                "User Background: %s\nGoals: %s",
                userBio, goals
        );
    }

    public String buildPlatformContext(String platform) {
        return String.format(
                "Content Guidelines for %s:\n" +
                        "- Follow platform best practices\n" +
                        "- Use platform-specific conventions and hashtags\n" +
                        "- Optimize for platform algorithms",
                platform
        );
    }
}
