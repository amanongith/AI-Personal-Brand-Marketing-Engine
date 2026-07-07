package com.personalbrand.controller;

import com.personalbrand.agents.ContentGenerationAgent;
import com.personalbrand.agents.ProfileAnalysisAgent;
import com.personalbrand.dto.request.GeneratePostRequest;
import com.personalbrand.service.AIService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@Tag(name = "AI", description = "AI generation endpoints")
@SecurityRequirement(name = "bearerAuth")
public class AIController {

    private final AIService aiService;
    private final ContentGenerationAgent contentGenerationAgent;
    private final ProfileAnalysisAgent profileAnalysisAgent;

    public AIController(AIService aiService, ContentGenerationAgent contentGenerationAgent,
                        ProfileAnalysisAgent profileAnalysisAgent) {
        this.aiService = aiService;
        this.contentGenerationAgent = contentGenerationAgent;
        this.profileAnalysisAgent = profileAnalysisAgent;
    }

    @PostMapping("/{userId}/generate-post")
    @Operation(summary = "Generate AI post")
    @ApiResponse(responseCode = "200", description = "Post generated successfully")
    public ResponseEntity<?> generatePost(@PathVariable Long userId, @RequestBody GeneratePostRequest request) {
        return ResponseEntity.ok(aiService.generateLinkedInPost(userId, request));
    }

    @PostMapping("/{userId}/generate-content/{platform}")
    @Operation(summary = "Generate content for platform")
    @ApiResponse(responseCode = "200", description = "Content generated successfully")
    public ResponseEntity<?> generateContent(@PathVariable Long userId, @PathVariable String platform,
                                             @RequestParam String topic) {
        return ResponseEntity.ok(contentGenerationAgent.generateContent(userId, platform, topic));
    }

    @GetMapping("/{userId}/analyze-profile")
    @Operation(summary = "Analyze user profile")
    @ApiResponse(responseCode = "200", description = "Profile analyzed successfully")
    public ResponseEntity<?> analyzeProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(profileAnalysisAgent.analyzeProfile(userId));
    }
}
