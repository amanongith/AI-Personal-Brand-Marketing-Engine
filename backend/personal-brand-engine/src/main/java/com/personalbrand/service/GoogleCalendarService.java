package com.personalbrand.service;

import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Events;
import com.personalbrand.entity.CalendarEvent;
import com.personalbrand.entity.User;
import com.personalbrand.enums.ContentStatus;
import com.personalbrand.enums.EventType;
import com.personalbrand.enums.Platform;
import com.personalbrand.repository.CalendarRepository;
import com.personalbrand.repository.SocialAccountRepository;
import com.personalbrand.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleCalendarService {

    private final CalendarRepository calendarRepository;
    private final UserRepository userRepository;
    private final SocialAccountRepository socialAccountRepository;
    private final SocialMediaService socialMediaService;

    /**
     * Attempts to sync events from Google Calendar.
     * If no credentials are setup, it falls back to generating mock events to keep the application functional.
     */
    @Transactional
    public void syncGoogleCalendar(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            log.warn("User {} not found, skipping Google Calendar sync", userId);
            return;
        }

        var optAccount = socialAccountRepository.findByUserIdAndPlatform(userId, "GOOGLE");
        if (optAccount.isEmpty()) {
            log.info("No active Google Calendar API connection found. Generating mock events for demonstration.");
            generateDemoEvents(user);
            return;
        }

        var account = optAccount.get();
        String accessToken = account.getAccessToken();

        // Check if token is expired and refresh if necessary (expires within 5 minutes)
        if (account.getExpiresAt() != null && account.getExpiresAt().isBefore(LocalDateTime.now().plusMinutes(5))) {
            log.info("Google access token expired or close to expiry, refreshing...");
            accessToken = socialMediaService.refreshGoogleAccessToken(account);
        }

        if (accessToken == null || accessToken.startsWith("mock_")) {
            log.info("Running Google Calendar sync in mock mode.");
            generateDemoEvents(user);
            return;
        }

        final String finalAccessToken = accessToken;
        try {
            // Build the Google Calendar API client
            com.google.api.client.http.HttpRequestInitializer requestInitializer = request -> request.getHeaders().setAuthorization("Bearer " + finalAccessToken);
            Calendar calendarService = new Calendar.Builder(
                    com.google.api.client.googleapis.javanet.GoogleNetHttpTransport.newTrustedTransport(),
                    com.google.api.client.json.gson.GsonFactory.getDefaultInstance(),
                    requestInitializer
            ).setApplicationName("AI-Personal-Brand-Marketing-Engine").build();

            // Retrieve next 10 events
            Events events = calendarService.events().list("primary")
                    .setMaxResults(10)
                    .setTimeMin(new com.google.api.client.util.DateTime(System.currentTimeMillis()))
                    .setOrderBy("startTime")
                    .setSingleEvents(true)
                    .execute();
            List<Event> items = events.getItems();

            if (items == null || items.isEmpty()) {
                log.info("No upcoming events found in Google Calendar.");
                return;
            }

            for (Event event : items) {
                // Convert Google Event to local CalendarEvent
                final String title = event.getSummary() != null ? event.getSummary() : "Untitled Event";

                LocalDateTime start = convertGoogleDateTime(event.getStart().getDateTime(), event.getStart().getDate());
                LocalDateTime end = convertGoogleDateTime(event.getEnd().getDateTime(), event.getEnd().getDate());

                // Deduplicate by title and start time
                boolean exists = calendarRepository.findByUserId(userId).stream()
                        .anyMatch(e -> e.getTitle().equalsIgnoreCase(title) && e.getStartTime().isEqual(start));

                if (!exists) {
                    CalendarEvent localEvent = CalendarEvent.builder()
                            .user(user)
                            .title(title)
                            .description(event.getDescription() != null ? event.getDescription() : "Google Calendar Synchronized Event")
                            .startTime(start)
                            .endTime(end)
                            .eventType(mapTitleToEventType(title))
                            .status(ContentStatus.DRAFT)
                            .build();

                    calendarRepository.save(localEvent);
                    log.info("Synchronized calendar event: {}", title);
                }
            }

        } catch (Exception e) {
            log.error("Error during Google Calendar sync", e);
            generateDemoEvents(user);
        }
    }

    private LocalDateTime convertGoogleDateTime(com.google.api.client.util.DateTime googleTime, com.google.api.client.util.DateTime googleDate) {
        long millis = googleTime != null ? googleTime.getValue() : (googleDate != null ? googleDate.getValue() : System.currentTimeMillis());
        return LocalDateTime.ofInstant(new Date(millis).toInstant(), ZoneId.systemDefault());
    }

    private EventType mapTitleToEventType(String title) {
        String lower = title.toLowerCase();
        if (lower.contains("meeting") || lower.contains("sync") || lower.contains("call")) {
            return EventType.MEETING;
        } else if (lower.contains("post") || lower.contains("publish")) {
            return EventType.CONTENT_POSTING;
        } else if (lower.contains("analytics") || lower.contains("metric")) {
            return EventType.ANALYTICS_REVIEW;
        }
        return EventType.MEETING;
    }

    /**
     * Generates a set of helpful demo events in the database if the calendar is empty.
     */
    @Transactional
    public void generateDemoEvents(User user) {
        long count = calendarRepository.findByUserId(user.getId()).size();
        if (count > 0) {
            log.debug("User already has calendar events, skipping demo event generation.");
            return;
        }

        log.info("Generating demo calendar events for user {}", user.getId());

        LocalDateTime now = LocalDateTime.now();

        // 1. Meeting Event
        CalendarEvent meeting = CalendarEvent.builder()
                .user(user)
                .title("Founder Sync: Bootstrap vs Venture Capital")
                .description("Catch up with startup founders. Discuss SaaS metrics and bootstrapping strategies.")
                .startTime(now.plusDays(1).withHour(14).withMinute(0))
                .endTime(now.plusDays(1).withHour(15).withMinute(0))
                .eventType(EventType.MEETING)
                .status(ContentStatus.SCHEDULED)
                .build();

        // 2. Content Posting Event
        CalendarEvent posting = CalendarEvent.builder()
                .user(user)
                .title("LinkedIn: Why Agentic AI is Replacing RAG")
                .description("Automated content release covering RAG ceilings and agentic multi-step reasoning.")
                .startTime(now.plusDays(2).withHour(9).withMinute(0))
                .endTime(now.plusDays(2).withHour(10).withMinute(0))
                .eventType(EventType.CONTENT_POSTING)
                .platform(Platform.LINKEDIN)
                .status(ContentStatus.DRAFT)
                .build();

        // 3. Analytics Review Event
        CalendarEvent review = CalendarEvent.builder()
                .user(user)
                .title("Weekly Personal Brand Metrics Review")
                .description("Check click rates, follower growth, and optimal posting times.")
                .startTime(now.plusDays(4).withHour(17).withMinute(0))
                .endTime(now.plusDays(4).withHour(18).withMinute(0))
                .eventType(EventType.ANALYTICS_REVIEW)
                .status(ContentStatus.SCHEDULED)
                .build();

        calendarRepository.save(meeting);
        calendarRepository.save(posting);
        calendarRepository.save(review);
    }
}
