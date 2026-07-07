package com.personalbrand.util;

public class AIUtils {

    public static String sanitizePrompt(String prompt) {
        return prompt != null ? prompt.trim().replaceAll("\\s+", " ") : "";
    }

    public static boolean isValidPlatform(String platform) {
        return platform != null && (
                platform.equalsIgnoreCase("linkedin") ||
                        platform.equalsIgnoreCase("instagram") ||
                        platform.equalsIgnoreCase("twitter") ||
                        platform.equalsIgnoreCase("youtube") ||
                        platform.equalsIgnoreCase("facebook") ||
                        platform.equalsIgnoreCase("tiktok")
        );
    }

    public static int estimateTokenCount(String text) {
        return (text != null ? text.split("\\s+").length : 0) * 4 / 3;
    }
}
