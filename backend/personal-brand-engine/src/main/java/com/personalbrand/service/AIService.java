package com.personalbrand.service;

import com.personalbrand.ai.client.OpenAIClient;
import com.personalbrand.ai.prompts.*;
import com.personalbrand.dto.request.GeneratePostRequest;
import com.personalbrand.entity.Content;
import com.personalbrand.exception.ResourceNotFoundException;
import com.personalbrand.repository.ContentRepository;
import com.personalbrand.repository.ProfileRepository;
import com.personalbrand.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIService {

    private final OpenAIClient openAIClient;
    private final ProfileRepository profileRepository;
    private final ContentRepository contentRepository;
    private final UserRepository userRepository;

    public String generateLinkedInPost(Long userId, GeneratePostRequest request) {
        var profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + userId));

        String prompt = LinkedInPrompt.generatePostPrompt(
                request.getTopic(),
                request.getTone(),
                profile.getNiche()
        );

        String systemPrompt = "You are an expert personal branding and marketing professional specializing in LinkedIn content creation.";
        log.info("Generating LinkedIn post for user {}", userId);

        return openAIClient.generateWithSystemPrompt(systemPrompt, prompt);
    }

    public String generateInstagramCaption(Long userId, GeneratePostRequest request) {
        var profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + userId));

        String prompt = InstagramPrompt.generateCaptionPrompt(
                request.getTopic(),
                request.getTone(),
                profile.getNiche()
        );

        String systemPrompt = "You are an expert Instagram content creator and personal branding strategist.";
        log.info("Generating Instagram caption for user {}", userId);

        return openAIClient.generateWithSystemPrompt(systemPrompt, prompt);
    }

    public String generateTwitterThread(Long userId, GeneratePostRequest request) {
        var profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + userId));

        String prompt = TwitterPrompt.generateThreadPrompt(
                request.getTopic(),
                profile.getNiche()
        );

        String systemPrompt = "You are an expert Twitter/X content strategist specializing in creating engaging threads.";
        log.info("Generating Twitter thread for user {}", userId);

        return openAIClient.generateWithSystemPrompt(systemPrompt, prompt);
    }

    public String generateYoutubeDescription(Long userId, GeneratePostRequest request) {
        var profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + userId));

        String prompt = YouTubePrompt.generateVideoDescriptionPrompt(
                request.getTopic(),
                profile.getNiche()
        );

        String systemPrompt = "You are an expert YouTube content strategist specializing in SEO-optimized video descriptions.";
        log.info("Generating YouTube description for user {}", userId);

        return openAIClient.generateWithSystemPrompt(systemPrompt, prompt);
    }

    public String generateHashtags(Long userId, GeneratePostRequest request) {
        String prompt = InstagramPrompt.generateHashtagsPrompt(request.getTopic());
        String systemPrompt = "You are an expert in social media hashtag strategy. Generate relevant and trending hashtags.";

        log.info("Generating hashtags for user {}", userId);
        return openAIClient.generateWithSystemPrompt(systemPrompt, prompt);
    }

    public String generateCTA(Long userId, GeneratePostRequest request) {
        String prompt = "Generate 3-5 compelling call-to-action statements for this content topic: " + request.getTopic();
        String systemPrompt = "You are an expert in conversion copywriting. Generate persuasive CTAs that drive engagement.";

        log.info("Generating CTA for user {}", userId);
        return openAIClient.generateWithSystemPrompt(systemPrompt, prompt);
    }

    public Content generateAndStoreContent(Long userId, GeneratePostRequest request) {
        String generatedContent = generateContentByPlatform(userId, request);
        String hashtags = generateHashtags(userId, request);
        String cta = generateCTA(userId, request);

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Content content = Content.builder()
                .user(user)
                .title(request.getTopic())
                .body(generatedContent)
                .platform(request.getPlatform())
                .status("DRAFT")
                .contentType(request.getContentType())
                .tags(hashtags)
                .build();

        log.info("Storing generated content for user {}", userId);
        return contentRepository.save(content);
    }

    private String generateContentByPlatform(Long userId, GeneratePostRequest request) {
        return switch (request.getPlatform().toLowerCase()) {
            case "linkedin" -> generateLinkedInPost(userId, request);
            case "instagram" -> generateInstagramCaption(userId, request);
            case "twitter" -> generateTwitterThread(userId, request);
            case "youtube" -> generateYoutubeDescription(userId, request);
            default -> openAIClient.generateCompletion(request.getTopic());
        };
    }
}
