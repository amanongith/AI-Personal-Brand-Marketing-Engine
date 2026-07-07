package com.personalbrand.controller;

import com.personalbrand.entity.Engagement;
import com.personalbrand.service.EngagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/engagement")
@Tag(name = "Engagement", description = "Engagement tracking endpoints")
@SecurityRequirement(name = "bearerAuth")
public class EngagementController {

    private final EngagementService engagementService;

    public EngagementController(EngagementService engagementService) {
        this.engagementService = engagementService;
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Get user engagement")
    @ApiResponse(responseCode = "200", description = "Engagement data retrieved successfully")
    public ResponseEntity<?> getUserEngagement(@PathVariable Long userId) {
        return ResponseEntity.ok(engagementService.getUserEngagement(userId));
    }

    @PostMapping
    @Operation(summary = "Record engagement")
    @ApiResponse(responseCode = "200", description = "Engagement recorded successfully")
    public ResponseEntity<?> recordEngagement(@RequestBody Engagement engagement) {
        return ResponseEntity.ok(engagementService.recordEngagement(engagement));
    }
}
