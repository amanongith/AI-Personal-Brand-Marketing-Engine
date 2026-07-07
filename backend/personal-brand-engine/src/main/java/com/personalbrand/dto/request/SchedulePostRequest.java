package com.personalbrand.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SchedulePostRequest {
    private Long contentId;
    private LocalDateTime scheduledTime;
    private String platform;
}
