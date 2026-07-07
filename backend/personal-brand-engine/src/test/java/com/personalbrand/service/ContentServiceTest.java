package com.personalbrand.service;
 
import com.personalbrand.entity.Content;
import com.personalbrand.entity.User;
import com.personalbrand.exception.ResourceNotFoundException;
import com.personalbrand.repository.ContentRepository;
import com.personalbrand.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
 
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
 
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
 
@ExtendWith(MockitoExtension.class)
public class ContentServiceTest {
 
    @Mock
    private ContentRepository contentRepository;
 
    @Mock
    private UserRepository userRepository;
 
    @InjectMocks
    private ContentService contentService;
 
    private User testUser;
    private Content testContent;
 
    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
 
        testContent = new Content();
        testContent.setId(10L);
        testContent.setTitle("Draft post");
        testContent.setBody("Content body");
        testContent.setUser(testUser);
        testContent.setStatus("DRAFT");
    }
 
    @Test
    void getUserContent_Success() {
        List<Content> contentsList = new ArrayList<>();
        contentsList.add(testContent);
        when(contentRepository.findByUserId(1L)).thenReturn(contentsList);
 
        List<Content> result = contentService.getUserContent(1L);
 
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Draft post", result.get(0).getTitle());
        verify(contentRepository, times(1)).findByUserId(1L);
    }
 
    @Test
    void createContentForUserEmail_Success() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(contentRepository.save(any(Content.class))).thenAnswer(invocation -> invocation.getArgument(0));
 
        Content saved = contentService.createContentForUserEmail("test@example.com", testContent);
 
        assertNotNull(saved);
        assertEquals(testUser, saved.getUser());
        assertEquals("DRAFT", saved.getStatus());
        verify(userRepository, times(1)).findByEmail("test@example.com");
        verify(contentRepository, times(1)).save(testContent);
    }
 
    @Test
    void createContentForUserEmail_UserNotFound_ThrowsException() {
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());
 
        assertThrows(ResourceNotFoundException.class, 
                () -> contentService.createContentForUserEmail("nonexistent@example.com", testContent));
        verify(contentRepository, never()).save(any(Content.class));
    }
 
    @Test
    void publishContent_Success() {
        when(contentRepository.findById(10L)).thenReturn(Optional.of(testContent));
        when(contentRepository.save(any(Content.class))).thenAnswer(invocation -> invocation.getArgument(0));
 
        contentService.publishContent(10L);
 
        assertEquals("PUBLISHED", testContent.getStatus());
        assertNotNull(testContent.getPublishedTime());
        verify(contentRepository, times(1)).findById(10L);
        verify(contentRepository, times(1)).save(testContent);
    }
 
    @Test
    void deleteContent_Success() {
        when(contentRepository.findById(10L)).thenReturn(Optional.of(testContent));
        doNothing().when(contentRepository).delete(testContent);
 
        contentService.deleteContent(10L);
 
        verify(contentRepository, times(1)).findById(10L);
        verify(contentRepository, times(1)).delete(testContent);
    }
}
