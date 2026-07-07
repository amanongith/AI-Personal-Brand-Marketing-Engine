package com.personalbrand.service;

import com.personalbrand.entity.CalendarEvent;
import com.personalbrand.entity.User;
import com.personalbrand.exception.ResourceNotFoundException;
import com.personalbrand.repository.CalendarRepository;
import com.personalbrand.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CalendarService {

    private final CalendarRepository calendarRepository;
    private final UserRepository userRepository;

    public List<CalendarEvent> getUpcomingEvents(Long userId) {
        return calendarRepository.findByUserIdAndStartTimeAfter(userId, LocalDateTime.now());
    }

    public List<CalendarEvent> getEventsByDateRange(Long userId, LocalDateTime start, LocalDateTime end) {
        return calendarRepository.findByUserIdAndStartTimeBetween(userId, start, end);
    }

    public CalendarEvent createEvent(Long userId, CalendarEvent event) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        event.setUser(user);
        return calendarRepository.save(event);
    }

    public CalendarEvent updateEvent(Long eventId, CalendarEvent event) {
        CalendarEvent existing = calendarRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + eventId));

        if (event.getTitle() != null) existing.setTitle(event.getTitle());
        if (event.getDescription() != null) existing.setDescription(event.getDescription());
        if (event.getStartTime() != null) existing.setStartTime(event.getStartTime());
        if (event.getEndTime() != null) existing.setEndTime(event.getEndTime());
        if (event.getEventType() != null) existing.setEventType(event.getEventType());
        if (event.getPlatform() != null) existing.setPlatform(event.getPlatform());
        if (event.getStatus() != null) existing.setStatus(event.getStatus());

        return calendarRepository.save(existing);
    }

    public void deleteEvent(Long eventId) {
        CalendarEvent event = calendarRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + eventId));
        calendarRepository.delete(event);
    }

    public List<CalendarEvent> getUserCalendarEvents(Long userId) {
        return calendarRepository.findByUserIdOrderByStartTimeAsc(userId);
    }
}
