package com.personalbrand.controller;

import com.personalbrand.entity.SocialAccount;
import com.personalbrand.service.SocialMediaService;
import com.personalbrand.repository.UserRepository;
import com.personalbrand.entity.User;
import com.personalbrand.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/oauth")
@Tag(name = "OAuth", description = "Social Media OAuth 2.0 Integration endpoints")
@RequiredArgsConstructor
@Slf4j
public class OAuthController {

    private final SocialMediaService socialMediaService;
    private final UserRepository userRepository;

    @GetMapping("/connect/{platform}")
    @Operation(summary = "Initiate social media OAuth connection")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> connect(
            @PathVariable String platform,
            @RequestParam String frontendOrigin) {
        
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        // Pack user ID and frontend origin into the OAuth 'state' parameter to restore session on callback
        String state = user.getId() + ":" + frontendOrigin;
        
        // Dynamically compute the callback URL on this server
        String callbackUri = frontendOrigin.contains("localhost") 
                ? "http://localhost:8080/api/oauth/callback/" + platform.toLowerCase()
                : "/api/oauth/callback/" + platform.toLowerCase();

        String authUrl = socialMediaService.getAuthorizationUrl(platform, state, callbackUri);
        
        Map<String, String> response = new HashMap<>();
        response.put("redirectUrl", authUrl);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/callback/{platform}")
    @Operation(summary = "OAuth authorization callback endpoint")
    public void callback(
            @PathVariable String platform,
            @RequestParam String code,
            @RequestParam String state,
            HttpServletResponse response) throws IOException {
        
        log.info("Received OAuth callback for platform: {} with state: {}", platform, state);
        
        // Parse user ID and frontend origin from state
        String[] parts = state.split(":", 2);
        Long userId = Long.parseLong(parts[0]);
        String frontendOrigin = parts.length > 1 ? parts[1] : "";

        String callbackUri = frontendOrigin.contains("localhost") 
                ? "http://localhost:8080/api/oauth/callback/" + platform.toLowerCase()
                : "/api/oauth/callback/" + platform.toLowerCase();

        try {
            socialMediaService.handleCallback(platform, code, callbackUri, userId);
            
            // Redirect back to frontend profile page with success message
            String redirectUrl = frontendOrigin.isEmpty() ? "/profile" : frontendOrigin + "/profile?connected=" + platform.toLowerCase();
            response.sendRedirect(redirectUrl);
        } catch (Exception e) {
            log.error("Error handling OAuth callback", e);
            String redirectUrl = frontendOrigin.isEmpty() ? "/profile" : frontendOrigin + "/profile?error=" + e.getMessage();
            response.sendRedirect(redirectUrl);
        }
    }

    @GetMapping("/accounts")
    @Operation(summary = "Get list of connected social accounts")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> getConnectedAccounts() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        List<SocialAccount> accounts = socialMediaService.getConnectedAccounts(user.getId());
        return ResponseEntity.ok(accounts);
    }

    @DeleteMapping("/disconnect/{platform}")
    @Operation(summary = "Disconnect social media platform")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> disconnectAccount(@PathVariable String platform) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        socialMediaService.disconnectAccount(user.getId(), platform);
        return ResponseEntity.ok(Map.of("message", "Successfully disconnected " + platform));
    }

    @PostMapping("/publish/{contentId}")
    @Operation(summary = "Publish content draft immediately to social network")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> publishContent(@PathVariable Long contentId) {
        boolean success = socialMediaService.publishPost(contentId);
        if (success) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Post successfully published!"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Failed to publish post. Ensure account is connected."));
        }
    }
}
