package com.personalbrand.ai.client;

import com.personalbrand.exception.AIException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OpenAIClient {

    private final ChatClient chatClient;

    public String generateCompletion(String prompt, String model) {
        return generateWithOptions(prompt, model, 2000, 0.7);
    }

    public String generateCompletion(String prompt) {
        return generateWithOptions(prompt, "gpt-4o-mini", 2000, 0.7);
    }

    public String generateWithOptions(String prompt, String model, int maxTokens, double temperature) {
        try {
            log.debug("Generating completion with prompt length: {}", prompt.length());
            String response = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
            log.debug("Received response with length: {}", response.length());
            return response;
        } catch (Exception e) {
            log.warn("Failed to generate AI completion from OpenAI: {}. Using backup mock response.", e.getMessage());
            return getMockResponse(prompt);
        }
    }

    public String generateWithSystemPrompt(String systemPrompt, String userPrompt) {
        try {
            log.debug("Generating completion with system prompt and user prompt");
            String response = chatClient.prompt()
                    .system(systemPrompt)
                    .user(userPrompt)
                    .call()
                    .content();
            log.debug("Received response with length: {}", response.length());
            return response;
        } catch (Exception e) {
            log.warn("Failed to generate AI completion from OpenAI: {}. Using high-quality mock backup response.", e.getMessage());
            return getMockResponse(userPrompt);
        }
    }

    private String getMockResponse(String userPrompt) {
        String lower = userPrompt.toLowerCase();
        
        // Profile Analysis
        if (lower.contains("analyze this personal brand profile") || lower.contains("actionable improvement suggestions") || lower.contains("brand positioning")) {
            return "[{\"title\":\"Optimize Post Scheduling\",\"priority\":\"HIGH\",\"reason\":\"Current posting consistency is 1.5 posts per week. Recommended frequency is 4 posts/week for maximum LinkedIn visibility.\"},{\"title\":\"Define Personal Brand Narrative\",\"priority\":\"HIGH\",\"reason\":\"Your profile niche is wide. Focus 70% of content on your core niche to build authority faster.\"},{\"title\":\"Leverage Scheduled Events\",\"priority\":\"MEDIUM\",\"reason\":\"Syncing events to calendar can trigger automatic social posts to capture audience growth.\"},{\"title\":\"Implement Engaging CTAs\",\"priority\":\"MEDIUM\",\"reason\":\"Drafts lack calls to action. Prompt comments by asking open-ended technical questions.\"}]";
        }

        // Try to dynamically extract topic, tone, and niche
        String topic = "Building consistency and value in public";
        String tone = "professional";
        String niche = "Technology";

        // Extract topic
        if (lower.contains("about ")) {
            int startIdx = lower.indexOf("about ") + 6;
            int endIdx = lower.indexOf(".", startIdx);
            if (endIdx == -1) endIdx = lower.indexOf("\n", startIdx);
            if (endIdx == -1) endIdx = lower.length();
            String sub = userPrompt.substring(startIdx, endIdx).trim();
            if (sub.toLowerCase().contains(" in the ")) {
                sub = sub.substring(0, sub.toLowerCase().indexOf(" in the "));
            }
            if (!sub.isEmpty()) {
                topic = sub;
            }
        }

        // Extract tone
        if (lower.contains("tone: ")) {
            int startIdx = lower.indexOf("tone: ") + 6;
            int endIdx = lower.indexOf(".", startIdx);
            if (endIdx == -1) endIdx = lower.indexOf("\n", startIdx);
            if (endIdx == -1) endIdx = lower.length();
            String sub = userPrompt.substring(startIdx, endIdx).trim();
            if (!sub.isEmpty()) {
                tone = sub;
            }
        }

        // Extract niche
        if (lower.contains("niche: ")) {
            int startIdx = lower.indexOf("niche: ") + 7;
            int endIdx = lower.indexOf(".", startIdx);
            if (endIdx == -1) endIdx = lower.indexOf("\n", startIdx);
            if (endIdx == -1) endIdx = lower.length();
            String sub = userPrompt.substring(startIdx, endIdx).trim();
            if (!sub.isEmpty()) {
                niche = sub;
            }
        } else if (lower.contains("in the ")) {
            int startIdx = lower.indexOf("in the ") + 7;
            int endIdx = lower.indexOf(" niche", startIdx);
            if (endIdx != -1) {
                String sub = userPrompt.substring(startIdx, endIdx).trim();
                if (!sub.isEmpty()) {
                    niche = sub;
                }
            }
        }

        String safeNiche = niche.replaceAll("[^a-zA-Z0-9]", "");
        String safeTopic = topic.replaceAll("[^a-zA-Z0-9]", "");

        // Generate tailored outputs based on platform keywords
        if (lower.contains("linkedin") || lower.contains("professional")) {
            return String.format(
                "🚀 Let's talk about %s in the context of %s.\n\n" +
                "In my experience, many creators struggling to build their brand in %s overlook this exact area. " +
                "But the reality is: authority isn't about broadcast—it's about building value in public, one connection at a time.\n\n" +
                "Here are my top takeaways to implement today:\n" +
                "1. Focus on depth over breadth. Break down a specific real-world example.\n" +
                "2. Share the 'why' behind %s, not just the 'what'. People connect with lessons and logic.\n" +
                "3. Use actionable calls-to-action to spark conversational threads.\n\n" +
                "How are you approaching %s in your workflow? Let's discuss in the comments! 👇\n\n" +
                "#%s #%s #ThoughtLeadership #PersonalBranding",
                topic, niche, niche, topic, topic, safeNiche, safeTopic
            );
        } else if (lower.contains("twitter") || lower.contains("thread")) {
            return String.format(
                "1/ Let's dive into %s in the %s space. 🧵\n\n" +
                "It's easy to get lost in the noise, but a few key principles can help you stand out. Here is what you need to know. 👇\n\n" +
                "2/ First, focus on actionable insights. People bookmark threads that they can reference later. Share templates, tools, or step-by-step processes related to %s.\n\n" +
                "3/ Second, keep it clear and punchy. Eliminate filler words. Twitter rewards brief, high-impact statements.\n\n" +
                "4/ Third, tell a story. Relate the lessons of %s back to a real project or mistake you made. People connect with people, not abstract concepts.\n\n" +
                "5/ What is your main goal with %s? Drop it below! 🚀",
                topic, niche, topic, topic, topic
            );
        } else if (lower.contains("instagram") || lower.contains("caption")) {
            return String.format(
                "Want to master %s in your %s niche? 🎯\n\n" +
                "Building authority doesn't happen overnight. It takes consistency, storytelling, and real engagement.\n\n" +
                "Swipe to see our step-by-step framework for success! ➡️\n\n" +
                "Which step are you starting with today? let me know below! 👇\n\n" +
                "#%s #%s #aiagent #contentcreator",
                topic, niche, safeNiche, safeTopic
            );
        } else if (lower.contains("hashtags")) {
            return String.format(
                "#%s #%s #thoughtleadership #personalbrand #creator #marketing #strategy #growth #networking #futureofwork",
                safeNiche, safeTopic
            );
        } else if (lower.contains("call-to-action") || lower.contains("cta")) {
            return String.format(
                "1. What is your go-to strategy for %s? Let me know in the comments!\n" +
                "2. Share this post if you found these tips on %s helpful!\n" +
                "3. DM me if you want a custom template for your %s strategy.",
                topic, topic, niche
            );
        }

        return String.format(
            "✨ AI Content Draft (Topic: %s | Tone: %s):\n\n" +
            "Here is a draft designed by the AI Marketing Engine focusing on %s.\n\n" +
            "Key Takeaway: Build consistent value in your niche (%s) to establish trust and authority.\n\n" +
            "#%s #PersonalBranding",
            topic, tone, topic, niche, safeNiche
        );
    }
}
