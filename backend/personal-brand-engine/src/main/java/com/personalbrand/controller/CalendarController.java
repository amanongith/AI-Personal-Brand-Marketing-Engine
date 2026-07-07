package com.personalbrand.controller;

import com.personalbrand.entity.CalendarEvent;
import com.personalbrand.service.CalendarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calendar")
@Tag(name = "Calendar", description = "Calendar event endpoints")
@SecurityRequirement(name = "bearerAuth")
public class CalendarController {

    private final CalendarService calendarService;

    public CalendarController(CalendarService calendarService) {
        this.calendarService = calendarService;
    }

    @GetMapping("/{userId}/upcoming")
    @Operation(summary = "Get upcoming events")
    @ApiResponse(responseCode = "200", description = "Events retrieved successfully")
    public ResponseEntity<?> getUpcomingEvents(@PathVariable Long userId) {
        return ResponseEntity.ok(calendarService.getUpcomingEvents(userId));
    }

    @PostMapping("/{userId}")
    @Operation(summary = "Create calendar event")
    @ApiResponse(responseCode = "200", description = "Event created successfully")
    public ResponseEntity<?> createEvent(@PathVariable Long userId, @RequestBody CalendarEvent event) {
        return ResponseEntity.ok(calendarService.createEvent(userId, event));
    }

    @PutMapping("/{eventId}")
    @Operation(summary = "Update calendar event")
    @ApiResponse(responseCode = "200", description = "Event updated successfully")
    public ResponseEntity<?> updateEvent(@PathVariable Long eventId, @RequestBody CalendarEvent event) {
        return ResponseEntity.ok(calendarService.updateEvent(eventId, event));
    }

    @DeleteMapping("/{eventId}")
    @Operation(summary = "Delete calendar event")
    @ApiResponse(responseCode = "200", description = "Event deleted successfully")
    public ResponseEntity<?> deleteEvent(@PathVariable Long eventId) {
        calendarService.deleteEvent(eventId);
        return ResponseEntity.ok("Event deleted");
    }

    @GetMapping("/{userId}/all")
    @Operation(summary = "Get all user calendar events")
    @ApiResponse(responseCode = "200", description = "Events retrieved successfully")
    public ResponseEntity<?> getUserCalendarEvents(@PathVariable Long userId) {
        return ResponseEntity.ok(calendarService.getUserCalendarEvents(userId));
    }
}
