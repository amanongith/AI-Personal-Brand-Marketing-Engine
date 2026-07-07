package com.personalbrand.ai.prompts;

public class TwitterPrompt {
    public static String generateTweetPrompt(String topic, String tone, String niche) {
        return String.format(
                "Generate a compelling tweet about %s. " +
                        "Tone: %s. Niche: %s. " +
                        "Keep it under 280 characters, include relevant hashtags, and make it viral-worthy.",
                topic, tone, niche
        );
    }

    public static String generateThreadPrompt(String topic, String niche) {
        return String.format(
                "Generate a Twitter thread (5-10 tweets) about %s in the %s niche. " +
                        "Make each tweet engaging and connected.",
                topic, niche
        );
    }
}
