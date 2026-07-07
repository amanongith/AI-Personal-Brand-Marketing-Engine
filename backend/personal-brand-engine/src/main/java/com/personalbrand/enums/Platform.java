package com.personalbrand.enums;

public enum Platform {
    LINKEDIN("linkedin"),
    INSTAGRAM("instagram"),
    TWITTER("twitter"),
    YOUTUBE("youtube"),
    FACEBOOK("facebook"),
    TIKTOK("tiktok");

    private final String value;

    Platform(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
