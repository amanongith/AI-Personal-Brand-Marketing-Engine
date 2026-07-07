package com.personalbrand.ai.prompts;

public class InstagramPrompt {
    public static String generateCaptionPrompt(String topic, String tone, String niche) {
        return String.format(
                "Generate an engaging Instagram caption about %s. " +
                        "Tone: %s. Niche: %s. " +
                        "Keep it concise, use emojis appropriately, and include trending hashtags. " +
                        "Make it relatable and encourage engagement.",
                topic, tone, niche
        );
    }

    public static String generateHashtagsPrompt(String topic) {
        return String.format(
                "Generate 20-30 relevant hashtags for an Instagram post about %s. " +
                        "Mix popular and niche hashtags.",
                topic
        );
    }
}
