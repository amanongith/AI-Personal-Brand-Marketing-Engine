package com.personalbrand.service;

import com.personalbrand.entity.Content;
import com.personalbrand.entity.User;
import com.personalbrand.exception.ResourceNotFoundException;
import com.personalbrand.repository.ContentRepository;
import com.personalbrand.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ContentService {

    private final ContentRepository contentRepository;
    private final UserRepository userRepository;

    public List<Content> getUserContent(Long userId) {
        return contentRepository.findByUserId(userId);
    }

    public List<Content> getContentByStatus(Long userId, String status) {
        return contentRepository.findByUserIdAndStatus(userId, status);
    }

    public List<Content> getScheduledContent(Long userId) {
        return contentRepository.findByUserIdAndStatusAndPublishedTimeIsNull(userId, "SCHEDULED");
    }

    public Content createContent(Content content) {
        User user = userRepository.findById(content.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + content.getUser().getId()));
        content.setUser(user);
        content.setStatus("DRAFT");
        return contentRepository.save(content);
    }

    public Content createContentForUserEmail(String email, Content content) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        content.setUser(user);
        if (content.getStatus() == null) {
            content.setStatus("DRAFT");
        }
        return contentRepository.save(content);
    }

    public Content updateContent(Long contentId, Content contentRequest) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new ResourceNotFoundException("Content not found: " + contentId));

        if (contentRequest.getTitle() != null) content.setTitle(contentRequest.getTitle());
        if (contentRequest.getBody() != null) content.setBody(contentRequest.getBody());
        if (contentRequest.getPlatform() != null) content.setPlatform(contentRequest.getPlatform());
        if (contentRequest.getStatus() != null) content.setStatus(contentRequest.getStatus());
        if (contentRequest.getContentType() != null) content.setContentType(contentRequest.getContentType());
        if (contentRequest.getTags() != null) content.setTags(contentRequest.getTags());
        if (contentRequest.getScheduledTime() != null) content.setScheduledTime(contentRequest.getScheduledTime());

        return contentRepository.save(content);
    }

    @Transactional
    public void publishContent(Long contentId) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new ResourceNotFoundException("Content not found: " + contentId));
        content.setStatus("PUBLISHED");
        content.setPublishedTime(LocalDateTime.now());
        contentRepository.save(content);
    }

    public void deleteContent(Long contentId) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new ResourceNotFoundException("Content not found: " + contentId));
        contentRepository.delete(content);
    }

    public long countPublishedContent(Long userId) {
        return contentRepository.countByUserIdAndStatus(userId, "PUBLISHED");
    }

    public long countScheduledContent(Long userId) {
        return contentRepository.countByUserIdAndStatus(userId, "SCHEDULED");
    }
}
