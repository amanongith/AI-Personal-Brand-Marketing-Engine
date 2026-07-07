package com.personalbrand.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIResponse {
    private String content;
    private String platform;
    private String tone;
    private Long tokensUsed;
}
