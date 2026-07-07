package com.personalbrand.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private String platform;
    private Long followers;
    private Long impressions;
    private Long clicks;
    private Long engagements;
    private Double engagementRate;
}
