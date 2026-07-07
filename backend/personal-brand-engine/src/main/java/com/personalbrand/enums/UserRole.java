package com.personalbrand.enums;

public enum UserRole {
    USER("USER"),
    ADMIN("ADMIN"),
    PREMIUM("PREMIUM");

    private final String value;

    UserRole(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
