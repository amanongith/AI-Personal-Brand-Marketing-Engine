package com.personalbrand.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "analytics")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Analytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(length = 50)
    private String platform;

    @Column
    private Long followers;

    @Column
    private Long impressions;

    @Column
    private Long clicks;

    @Column
    private Long engagements;

    @Column
    private Double engagementRate;

    @Column
    private Double brandScore;

    @Column
    private LocalDateTime metricsDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (metricsDate == null) {
            metricsDate = LocalDateTime.now();
        }
        if (followers == null) followers = 0L;
        if (impressions == null) impressions = 0L;
        if (clicks == null) clicks = 0L;
        if (engagements == null) engagements = 0L;
        if (engagementRate == null) engagementRate = 0.0;
        if (brandScore == null) brandScore = 0.0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
