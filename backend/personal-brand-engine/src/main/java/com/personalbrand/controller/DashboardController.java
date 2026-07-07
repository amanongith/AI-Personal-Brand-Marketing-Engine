package com.personalbrand.controller;

import com.personalbrand.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Dashboard endpoints")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Get dashboard data")
    @ApiResponse(responseCode = "200", description = "Dashboard data retrieved successfully")
    public ResponseEntity<?> getDashboardData(@PathVariable Long userId) {
        return ResponseEntity.ok(dashboardService.getDashboardData(userId));
    }
}
