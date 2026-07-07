package com.personalbrand.ai.parser;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

@Component
public class AIResponseParser {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String extractContent(String response) {
        return response != null ? response.trim() : "";
    }

    public String[] splitIntoSections(String response) {
        return response != null ? response.split("\n\n") : new String[0];
    }

    public String removeDuplicateNewlines(String text) {
        return text != null ? text.replaceAll("\\n{2,}", "\n") : "";
    }

    public String cleanHTMLTags(String text) {
        return text != null ? text.replaceAll("<[^>]*>", "") : "";
    }
}
