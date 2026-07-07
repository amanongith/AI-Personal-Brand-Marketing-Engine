package com.personalbrand.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "content")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String body;

    @Column(length = 50)
    private String platform;

    @Column(length = 50)
    private String status;

    @Column(length = 50)
    private String contentType;

    @Column(columnDefinition = "TEXT")
    private String tags;

    @Column
    private LocalDateTime scheduledTime;

    @Column
    private LocalDateTime publishedTime;

    @Column
    private Long views;

    @Column
    private Long likes;

    @Column
    private Long shares;

    @Column
    private Double engagementScore;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Set<Engagement> engagements;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "DRAFT";
        }
        if (views == null) {
            views = 0L;
        }
        if (likes == null) {
            likes = 0L;
        }
        if (shares == null) {
            shares = 0L;
        }
        if (engagementScore == null) {
            engagementScore = 0.0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
