package com.personalbrand.controller;

import com.personalbrand.entity.Profile;
import com.personalbrand.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
@Tag(name = "Profiles", description = "User profile endpoints")
@SecurityRequirement(name = "bearerAuth")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Get user profile")
    @ApiResponse(responseCode = "200", description = "Profile retrieved successfully")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getProfileByUserId(userId));
    }

    @PostMapping("/{userId}")
    @Operation(summary = "Create user profile")
    @ApiResponse(responseCode = "200", description = "Profile created successfully")
    public ResponseEntity<?> createProfile(@PathVariable Long userId, @RequestBody Profile profile) {
        return ResponseEntity.ok(profileService.createProfile(userId, profile));
    }

    @PutMapping("/{userId}")
    @Operation(summary = "Update user profile")
    @ApiResponse(responseCode = "200", description = "Profile updated successfully")
    public ResponseEntity<?> updateProfile(@PathVariable Long userId, @RequestBody Profile profile) {
        return ResponseEntity.ok(profileService.updateProfile(userId, profile));
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "Delete user profile")
    @ApiResponse(responseCode = "200", description = "Profile deleted successfully")
    public ResponseEntity<?> deleteProfile(@PathVariable Long userId) {
        profileService.deleteProfile(userId);
        return ResponseEntity.ok("Profile deleted");
    }
}
