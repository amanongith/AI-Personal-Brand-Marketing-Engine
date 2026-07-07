package com.personalbrand.controller;

import com.personalbrand.entity.Analytics;
import com.personalbrand.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics", description = "Analytics endpoints")
@SecurityRequirement(name = "bearerAuth")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Get user analytics")
    @ApiResponse(responseCode = "200", description = "Analytics retrieved successfully")
    public ResponseEntity<?> getUserAnalytics(@PathVariable Long userId) {
        return ResponseEntity.ok(analyticsService.getUserAnalytics(userId));
    }

    @PostMapping
    @Operation(summary = "Record analytics")
    @ApiResponse(responseCode = "200", description = "Analytics recorded successfully")
    public ResponseEntity<?> recordAnalytics(@RequestBody Analytics analytics) {
        return ResponseEntity.ok(analyticsService.recordAnalytics(analytics));
    }
}
