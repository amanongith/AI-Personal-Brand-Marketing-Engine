package com.personalbrand.service;

import com.personalbrand.entity.Content;
import com.personalbrand.entity.SocialAccount;
import com.personalbrand.entity.User;
import com.personalbrand.exception.ResourceNotFoundException;
import com.personalbrand.repository.ContentRepository;
import com.personalbrand.repository.SocialAccountRepository;
import com.personalbrand.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SocialMediaService {

    private final SocialAccountRepository socialAccountRepository;
    private final UserRepository userRepository;
    private final ContentRepository contentRepository;
    private final NotificationService notificationService;

    @Value("${social.linkedin.client-id:mock-linkedin-id}")
    private String linkedinClientId;

    @Value("${social.linkedin.client-secret:mock-linkedin-secret}")
    private String linkedinClientSecret;

    @Value("${social.twitter.client-id:mock-twitter-id}")
    private String twitterClientId;

    @Value("${social.twitter.client-secret:mock-twitter-secret}")
    private String twitterClientSecret;

    @Value("${social.google.client-id:mock-google-id}")
    private String googleClientId;

    @Value("${social.google.client-secret:mock-google-secret}")
    private String googleClientSecret;

    private final RestClient restClient = RestClient.create();

    public List<SocialAccount> getConnectedAccounts(Long userId) {
        return socialAccountRepository.findByUserId(userId);
    }

    public void disconnectAccount(Long userId, String platform) {
        socialAccountRepository.findByUserIdAndPlatform(userId, platform.toUpperCase())
                .ifPresent(account -> {
                    socialAccountRepository.delete(account);
                    log.info("Disconnected platform {} for user {}", platform, userId);
                });
    }

    public String getAuthorizationUrl(String platform, String state, String redirectUri) {
        String upperPlatform = platform.toUpperCase();
        if ("LINKEDIN".equals(upperPlatform)) {
            if (isMockMode(linkedinClientId)) {
                return redirectUri + "?code=mock_linkedin_code&state=" + state;
            }
            return "https://www.linkedin.com/oauth/v2/authorization" +
                    "?response_type=code" +
                    "&client_id=" + linkedinClientId +
                    "&redirect_uri=" + redirectUri +
                    "&state=" + state +
                    "&scope=w_member_social%20openid%20profile%20email";
        } else if ("TWITTER".equals(upperPlatform)) {
            if (isMockMode(twitterClientId)) {
                return redirectUri + "?code=mock_twitter_code&state=" + state;
            }
            // Using OAuth 2.0 PKCE flow (Simplified state/challenge for implementation brevity)
            return "https://twitter.com/i/oauth2/authorize" +
                    "?response_type=code" +
                    "&client_id=" + twitterClientId +
                    "&redirect_uri=" + redirectUri +
                    "&state=" + state +
                    "&code_challenge=challenge" +
                    "&code_challenge_method=plain" +
                    "&scope=tweet.read%20tweet.write%20users.read%20offline.access";
        } else if ("GOOGLE".equals(upperPlatform)) {
            if (isMockMode(googleClientId)) {
                return redirectUri + "?code=mock_google_code&state=" + state;
            }
            return "https://accounts.google.com/o/oauth2/v2/auth" +
                    "?response_type=code" +
                    "&client_id=" + googleClientId +
                    "&redirect_uri=" + redirectUri +
                    "&state=" + state +
                    "&scope=https://www.googleapis.com/auth/calendar%20openid%20profile%20email" +
                    "&access_type=offline" +
                    "&prompt=consent";
        }
        throw new IllegalArgumentException("Unsupported platform: " + platform);
    }

    public SocialAccount handleCallback(String platform, String code, String redirectUri, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        String upperPlatform = platform.toUpperCase();
        SocialAccount account = socialAccountRepository.findByUserIdAndPlatform(userId, upperPlatform)
                .orElse(SocialAccount.builder()
                        .user(user)
                        .platform(upperPlatform)
                        .build());

        if ("LINKEDIN".equals(upperPlatform)) {
            if (isMockMode(linkedinClientId) || "mock_linkedin_code".equals(code)) {
                account.setAccessToken("mock_linkedin_access_token_" + System.currentTimeMillis());
                account.setRefreshToken("mock_linkedin_refresh_token");
                account.setExpiresAt(LocalDateTime.now().plusDays(60));
                account.setSocialAccountId("li_mock_user_123");
                account.setUsername(user.getFirstName() + " " + user.getLastName() + " (LinkedIn)");
                account.setProfileImageUrl("https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100");
            } else {
                exchangeLinkedInToken(account, code, redirectUri);
            }
        } else if ("TWITTER".equals(upperPlatform)) {
            if (isMockMode(twitterClientId) || "mock_twitter_code".equals(code)) {
                account.setAccessToken("mock_twitter_access_token_" + System.currentTimeMillis());
                account.setRefreshToken("mock_twitter_refresh_token");
                account.setExpiresAt(LocalDateTime.now().plusHours(2));
                account.setSocialAccountId("tw_mock_user_123");
                account.setUsername("@" + user.getFirstName().toLowerCase() + user.getLastName().toLowerCase());
                account.setProfileImageUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100");
            } else {
                exchangeTwitterToken(account, code, redirectUri);
            }
        } else if ("GOOGLE".equals(upperPlatform)) {
            if (isMockMode(googleClientId) || "mock_google_code".equals(code)) {
                account.setAccessToken("mock_google_access_token_" + System.currentTimeMillis());
                account.setRefreshToken("mock_google_refresh_token");
                account.setExpiresAt(LocalDateTime.now().plusHours(1));
                account.setSocialAccountId("google_mock_user_123");
                account.setUsername(user.getFirstName() + " " + user.getLastName() + " (Google)");
                account.setProfileImageUrl("https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100");
            } else {
                exchangeGoogleToken(account, code, redirectUri);
            }
        }

        SocialAccount saved = socialAccountRepository.save(account);
        notificationService.sendEmailNotification(user.getEmail(), "Account Connected", "Successfully connected " + upperPlatform + " account!");
        return saved;
    }

    public boolean publishPost(Long contentId) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new ResourceNotFoundException("Content not found: " + contentId));

        Long userId = content.getUser().getId();
        String platform = content.getPlatform().toUpperCase();

        Optional<SocialAccount> optAccount = socialAccountRepository.findByUserIdAndPlatform(userId, platform);
        if (optAccount.isEmpty()) {
            log.warn("Cannot publish post {}: No connected account found for platform {}", contentId, platform);
            return false;
        }

        SocialAccount account = optAccount.get();
        boolean success = false;

        try {
            if ("LINKEDIN".equals(platform)) {
                if (isMockMode(linkedinClientId) || account.getAccessToken().startsWith("mock_")) {
                    log.info("[SIMULATION] Successfully posted to LinkedIn: {}", content.getBody());
                    success = true;
                } else {
                    success = postToLinkedIn(account, content.getBody());
                }
            } else if ("TWITTER".equals(platform)) {
                if (isMockMode(twitterClientId) || account.getAccessToken().startsWith("mock_")) {
                    log.info("[SIMULATION] Successfully posted to Twitter: {}", content.getBody());
                    success = true;
                } else {
                    success = postToTwitter(account, content.getBody());
                }
            }
        } catch (Exception e) {
            log.error("Failed to publish post to {} due to error: ", platform, e);
        }

        if (success) {
            content.setStatus("PUBLISHED");
            content.setPublishedTime(LocalDateTime.now());
            contentRepository.save(content);

            String message = String.format("Successfully published post: '%s' to %s", content.getTitle(), platform);
            com.personalbrand.security.NotificationWebSocketHandler.sendNotification("PUBLISH", message);
            notificationService.sendContentPublishedNotification(content.getUser().getEmail(), content.getTitle());
        } else {
            String message = String.format("Failed to publish post: '%s' to %s. Check connection.", content.getTitle(), platform);
            com.personalbrand.security.NotificationWebSocketHandler.sendNotification("ERROR", message);
        }

        return success;
    }

    private void exchangeLinkedInToken(SocialAccount account, String code, String redirectUri) {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("code", code);
        body.add("redirect_uri", redirectUri);
        body.add("client_id", linkedinClientId);
        body.add("client_secret", linkedinClientSecret);

        try {
            Map<?, ?> response = restClient.post()
                    .uri("https://www.linkedin.com/oauth/v2/accessToken")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("access_token")) {
                account.setAccessToken((String) response.get("access_token"));
                if (response.containsKey("refresh_token")) {
                    account.setRefreshToken((String) response.get("refresh_token"));
                }
                if (response.containsKey("expires_in")) {
                    Number expiresVal = (Number) response.get("expires_in");
                    account.setExpiresAt(LocalDateTime.now().plusSeconds(expiresVal.longValue()));
                }

                // Fetch user profile info using OpenID Connect endpoint
                Map<?, ?> profile = restClient.get()
                        .uri("https://api.linkedin.com/v2/userinfo")
                        .headers(h -> h.setBearerAuth(account.getAccessToken()))
                        .retrieve()
                        .body(Map.class);

                if (profile != null) {
                    account.setSocialAccountId((String) profile.get("sub"));
                    String name = (String) profile.get("name");
                    if (name == null) {
                        name = (String) profile.get("given_name") + " " + (String) profile.get("family_name");
                    }
                    account.setUsername(name);
                    account.setProfileImageUrl((String) profile.get("picture"));
                }
            }
        } catch (Exception e) {
            log.error("Failed to exchange LinkedIn token", e);
            throw new RuntimeException("Failed to connect LinkedIn: " + e.getMessage());
        }
    }

    private void exchangeTwitterToken(SocialAccount account, String code, String redirectUri) {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("code", code);
        body.add("redirect_uri", redirectUri);
        body.add("client_id", twitterClientId);
        body.add("code_verifier", "challenge"); // PKCE verifier

        try {
            // Twitter requires basic authentication header for client confidential credentials
            Map<?, ?> response = restClient.post()
                    .uri("https://api.twitter.com/2/oauth2/token")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .headers(h -> h.setBasicAuth(twitterClientId, twitterClientSecret))
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("access_token")) {
                account.setAccessToken((String) response.get("access_token"));
                if (response.containsKey("refresh_token")) {
                    account.setRefreshToken((String) response.get("refresh_token"));
                }
                if (response.containsKey("expires_in")) {
                    Number expiresVal = (Number) response.get("expires_in");
                    account.setExpiresAt(LocalDateTime.now().plusSeconds(expiresVal.longValue()));
                }

                // Fetch Twitter user details
                Map<?, ?> userResponse = restClient.get()
                        .uri("https://api.twitter.com/2/users/me?user.fields=profile_image_url")
                        .headers(h -> h.setBearerAuth(account.getAccessToken()))
                        .retrieve()
                        .body(Map.class);

                if (userResponse != null && userResponse.containsKey("data")) {
                    Map<?, ?> data = (Map<?, ?>) userResponse.get("data");
                    account.setSocialAccountId((String) data.get("id"));
                    account.setUsername((String) data.get("name") + " (@" + (String) data.get("username") + ")");
                    account.setProfileImageUrl((String) data.get("profile_image_url"));
                }
            }
        } catch (Exception e) {
            log.error("Failed to exchange Twitter token", e);
            throw new RuntimeException("Failed to connect Twitter: " + e.getMessage());
        }
    }

    private boolean postToLinkedIn(SocialAccount account, String text) {
        String payload = String.format("""
            {
              "author": "urn:li:person:%s",
              "lifecycleState": "PUBLISHED",
              "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                  "shareCommentary": {
                    "text": "%s"
                  },
                  "shareMediaCategory": "NONE"
                }
              },
              "visibility": {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
              }
            }
            """, account.getSocialAccountId(), escapeJson(text));

        ResponseEntity<String> response = restClient.post()
                .uri("https://api.linkedin.com/v2/ugcPosts")
                .headers(h -> {
                    h.setBearerAuth(account.getAccessToken());
                    h.setContentType(MediaType.APPLICATION_JSON);
                })
                .body(payload)
                .retrieve()
                .toEntity(String.class);

        return response.getStatusCode().is2xxSuccessful();
    }

    private boolean postToTwitter(SocialAccount account, String text) {
        String payload = String.format("{\"text\": \"%s\"}", escapeJson(text));

        ResponseEntity<String> response = restClient.post()
                .uri("https://api.twitter.com/2/tweets")
                .headers(h -> {
                    h.setBearerAuth(account.getAccessToken());
                    h.setContentType(MediaType.APPLICATION_JSON);
                })
                .body(payload)
                .retrieve()
                .toEntity(String.class);

        return response.getStatusCode().is2xxSuccessful();
    }

    private boolean isMockMode(String value) {
        return value == null || value.trim().isEmpty() || value.startsWith("mock-");
    }

    private String escapeJson(String text) {
        if (text == null) return "";
        return text.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    private void exchangeGoogleToken(SocialAccount account, String code, String redirectUri) {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("code", code);
        body.add("redirect_uri", redirectUri);
        body.add("client_id", googleClientId);
        body.add("client_secret", googleClientSecret);

        try {
            Map<?, ?> response = restClient.post()
                    .uri("https://oauth2.googleapis.com/token")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("access_token")) {
                account.setAccessToken((String) response.get("access_token"));
                if (response.containsKey("refresh_token")) {
                    account.setRefreshToken((String) response.get("refresh_token"));
                }
                if (response.containsKey("expires_in")) {
                    Number expiresVal = (Number) response.get("expires_in");
                    account.setExpiresAt(LocalDateTime.now().plusSeconds(expiresVal.longValue()));
                }

                // Fetch Google user profile details
                Map<?, ?> profile = restClient.get()
                        .uri("https://www.googleapis.com/oauth2/v3/userinfo")
                        .headers(h -> h.setBearerAuth(account.getAccessToken()))
                        .retrieve()
                        .body(Map.class);

                if (profile != null) {
                    account.setSocialAccountId((String) profile.get("sub"));
                    account.setUsername((String) profile.get("name"));
                    account.setProfileImageUrl((String) profile.get("picture"));
                }
            }
        } catch (Exception e) {
            log.error("Failed to exchange Google token", e);
            throw new RuntimeException("Failed to connect Google Calendar: " + e.getMessage());
        }
    }

    public String refreshGoogleAccessToken(SocialAccount account) {
        if (account.getRefreshToken() == null || account.getRefreshToken().startsWith("mock_")) {
            return account.getAccessToken();
        }

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "refresh_token");
        body.add("refresh_token", account.getRefreshToken());
        body.add("client_id", googleClientId);
        body.add("client_secret", googleClientSecret);

        try {
            Map<?, ?> response = restClient.post()
                    .uri("https://oauth2.googleapis.com/token")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("access_token")) {
                String newAccessToken = (String) response.get("access_token");
                account.setAccessToken(newAccessToken);
                if (response.containsKey("expires_in")) {
                    Number expiresVal = (Number) response.get("expires_in");
                    account.setExpiresAt(LocalDateTime.now().plusSeconds(expiresVal.longValue()));
                }
                socialAccountRepository.save(account);
                return newAccessToken;
            }
        } catch (Exception e) {
            log.error("Failed to refresh Google access token", e);
        }
        return account.getAccessToken();
    }
}
