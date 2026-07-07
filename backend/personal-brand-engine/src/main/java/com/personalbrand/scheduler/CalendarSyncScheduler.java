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

    @Scheduled(fixedRate = 60000) // Run every 60 seconds for demo convenience
    public void syncCalendarEvents() {
        // Sync calendar events from Google Calendar
        // In demo mode, it falls back to creating beautiful demo calendar events if the repository is empty
        googleCalendarService.syncGoogleCalendar(1L, null);
    }
}
