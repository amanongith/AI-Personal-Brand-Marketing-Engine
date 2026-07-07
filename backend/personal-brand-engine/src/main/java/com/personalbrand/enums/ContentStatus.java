package com.personalbrand.enums;

public enum ContentStatus {
    DRAFT("draft"),
    SCHEDULED("scheduled"),
    PUBLISHED("published"),
    ARCHIVED("archived");

    private final String value;

    ContentStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
