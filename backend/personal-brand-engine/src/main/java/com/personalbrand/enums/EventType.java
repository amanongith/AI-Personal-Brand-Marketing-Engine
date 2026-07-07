package com.personalbrand.enums;

public enum EventType {
    CONTENT_POSTING("content_posting"),
    ENGAGEMENT_TRACKING("engagement_tracking"),
    ANALYTICS_REVIEW("analytics_review"),
    MEETING("meeting");

    private final String value;

    EventType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
