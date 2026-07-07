package com.personalbrand.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 255)
    private String website;

    @Column(length = 255)
    private String location;

    @Column(length = 100)
    private String industry;

    @Column(length = 100)
    private String niche;

    @Column(columnDefinition = "TEXT")
    private String personalBrandStatement;

    @Column(columnDefinition = "TEXT")
    private String targetAudience;

    @Column(columnDefinition = "TEXT")
    private String coreValues;

    @Column(columnDefinition = "TEXT")
    private String socialLinks;

    @Column
    private Integer experienceYears;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
