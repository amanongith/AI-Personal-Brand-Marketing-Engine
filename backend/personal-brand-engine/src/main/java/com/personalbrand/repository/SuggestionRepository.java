package com.personalbrand.repository;

import com.personalbrand.entity.Suggestion;
import com.personalbrand.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuggestionRepository extends JpaRepository<Suggestion, Long> {
    List<Suggestion> findByUser(User user);

    List<Suggestion> findByUserId(Long userId);

    List<Suggestion> findByUserIdAndStatus(Long userId, String status);

    List<Suggestion> findByUserIdAndSuggestionType(Long userId, String type);

    List<Suggestion> findByUserIdAndPriority(Long userId, String priority);

    List<Suggestion> findByUserIdOrderByCreatedAtDesc(Long userId);
}

