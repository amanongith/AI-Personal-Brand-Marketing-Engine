package com.personalbrand.ai.client;

import com.personalbrand.exception.AIException;
import org.springframework.stereotype.Component;

@Component
public class OllamaClient {

    public String generateCompletion(String prompt, String model) {
        try {
            // Implementation for Ollama local model
            // This is a placeholder for integration with local Ollama instance
            throw new AIException("Ollama integration not yet implemented");
        } catch (Exception e) {
            throw new AIException("Failed to generate completion from Ollama: " + e.getMessage(), e);
        }
    }
}
