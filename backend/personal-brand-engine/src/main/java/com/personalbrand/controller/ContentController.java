package com.personalbrand.controller;

import com.personalbrand.entity.Content;
import com.personalbrand.service.ContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/content")
@Tag(name = "Content", description = "Content management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class ContentController {

    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Get user content")
    @ApiResponse(responseCode = "200", description = "Content retrieved successfully")
    public ResponseEntity<?> getUserContent(@PathVariable Long userId) {
        return ResponseEntity.ok(contentService.getUserContent(userId));
    }

    @PostMapping
    @Operation(summary = "Create content")
    @ApiResponse(responseCode = "200", description = "Content created successfully")
    public ResponseEntity<?> createContent(@RequestBody Content content) {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(contentService.createContentForUserEmail(email, content));
    }

    @PutMapping("/{contentId}")
    @Operation(summary = "Update content")
    @ApiResponse(responseCode = "200", description = "Content updated successfully")
    public ResponseEntity<?> updateContent(@PathVariable Long contentId, @RequestBody Content content) {
        return ResponseEntity.ok(contentService.updateContent(contentId, content));
    }

    @DeleteMapping("/{contentId}")
    @Operation(summary = "Delete content")
    @ApiResponse(responseCode = "200", description = "Content deleted successfully")
    public ResponseEntity<?> deleteContent(@PathVariable Long contentId) {
        contentService.deleteContent(contentId);
        return ResponseEntity.ok("Content deleted");
    }
}
