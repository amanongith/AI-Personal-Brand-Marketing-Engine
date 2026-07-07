package com.personalbrand.ai.prompts;

public class LinkedInPrompt {
    public static String generatePostPrompt(String topic, String tone, String niche) {
        return String.format(
                "Generate a professional LinkedIn post about %s. " +
                        "Tone: %s. Niche: %s. " +
                        "The post should be engaging, insightful, and suitable for a professional audience. " +
                        "Include relevant hashtags and call-to-action.",
                topic, tone, niche
        );
    }

    public static String generateArticlePrompt(String topic, String niche) {
        return String.format(
                "Generate a LinkedIn article about %s related to %s niche. " +
                        "Make it comprehensive, engaging, and thought-provoking.",
                topic, niche
        );
    }
}
