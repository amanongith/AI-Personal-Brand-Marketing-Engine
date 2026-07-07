package com.personalbrand.ai.prompts;

public class YouTubePrompt {
    public static String generateVideoTitlePrompt(String topic, String niche) {
        return String.format(
                "Generate 5 compelling YouTube video titles for %s in the %s niche. " +
                        "Include SEO keywords and make them click-worthy.",
                topic, niche
        );
    }

    public static String generateVideoDescriptionPrompt(String topic, String niche) {
        return String.format(
                "Generate a detailed YouTube video description for %s in the %s niche. " +
                        "Include timestamps, keywords, and call-to-action.",
                topic, niche
        );
    }
}
