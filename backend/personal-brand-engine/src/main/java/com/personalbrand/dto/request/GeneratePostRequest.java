package com.personalbrand.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeneratePostRequest {
    private String platform;
    private String topic;
    private String tone;
    private String contentType;
    private String additionalInstructions;
}
