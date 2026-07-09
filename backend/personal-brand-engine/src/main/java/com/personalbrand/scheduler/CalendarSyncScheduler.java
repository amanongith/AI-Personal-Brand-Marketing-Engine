package com.personalbrand.scheduler;

import com.personalbrand.service.GoogleCalendarService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CalendarSyncScheduler {

    private final GoogleCalendarService googleCalendarService;

    public CalendarSyncScheduler(GoogleCalendarService googleCalendarService) {
        this.googleCalendarService = googleCalendarService;
    }

    @Scheduled(fixedRate = 300000) // Run every 5 minutes (300000 ms)
    public void syncCalendarEvents() {
        // Sync calendar events from Google Calendar
        // In mock mode, it automatically populates demo events on first sync
        googleCalendarService.syncGoogleCalendar(1L);
    }
}
