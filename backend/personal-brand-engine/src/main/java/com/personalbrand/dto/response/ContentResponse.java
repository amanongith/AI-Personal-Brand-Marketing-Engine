package com.personalbrand.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContentResponse {
    private Long id;
    private String title;
    private String body;
    private String platform;
    private String status;
    private Long views;
    private Long likes;
    private Long shares;
}
