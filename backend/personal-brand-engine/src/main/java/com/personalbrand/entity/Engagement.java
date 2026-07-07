package com.personalbrand.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "engagement")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Engagement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Content content;

    @Column(length = 50)
    private String engagementType;

    @Column
    private Long engagementCount;

    @Column(length = 50)
    private String platform;

    @Column
    private LocalDateTime engagementDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (engagementDate == null) {
            engagementDate = LocalDateTime.now();
        }
        if (engagementCount == null) {
            engagementCount = 0L;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
