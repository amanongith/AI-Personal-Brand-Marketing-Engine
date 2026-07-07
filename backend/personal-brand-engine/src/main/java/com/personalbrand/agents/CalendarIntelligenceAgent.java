package com.personalbrand.agents;

import com.personalbrand.repository.CalendarRepository;
import org.springframework.stereotype.Component;

@Component
public class CalendarIntelligenceAgent {

    private final CalendarRepository calendarRepository;

    public CalendarIntelligenceAgent(CalendarRepository calendarRepository) {
        this.calendarRepository = calendarRepository;
    }

    public String getUpcomingEvents(Long userId) {
        var events = calendarRepository.findByUserId(userId);
        return events.isEmpty() ? "No upcoming events" : events.toString();
    }

    public String suggestContentSchedule(Long userId) {
        var events = calendarRepository.findByUserId(userId);
        return String.format("Suggested posting schedule based on %d calendar events", events.size());
    }
}
