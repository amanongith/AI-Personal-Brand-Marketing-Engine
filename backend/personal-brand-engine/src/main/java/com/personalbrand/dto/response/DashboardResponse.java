package com.personalbrand.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {
    private Long totalPosts;
    private Long upcomingPosts;
    private Long draftPosts;
    private Long totalEngagement;
    private Long followers;
    private Double engagementRate;
    private Double brandScore;
}
