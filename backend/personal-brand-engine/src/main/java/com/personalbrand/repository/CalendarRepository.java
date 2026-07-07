package com.personalbrand.repository;

import com.personalbrand.entity.CalendarEvent;
import com.personalbrand.entity.User;
import com.personalbrand.enums.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CalendarRepository extends JpaRepository<CalendarEvent, Long> {
    List<CalendarEvent> findByUser(User user);

    List<CalendarEvent> findByUserId(Long userId);

    List<CalendarEvent> findByUserIdAndStartTimeAfter(Long userId, LocalDateTime startTime);

    List<CalendarEvent> findByUserIdAndStartTimeBetween(Long userId, LocalDateTime start, LocalDateTime end);

    List<CalendarEvent> findByUserIdAndEventType(Long userId, EventType eventType);

    List<CalendarEvent> findByUserIdOrderByStartTimeAsc(Long userId);
}

