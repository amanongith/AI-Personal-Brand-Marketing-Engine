package com.personalbrand.controller;
 
import com.personalbrand.dto.request.UpdateUserRequest;
import com.personalbrand.entity.User;
import com.personalbrand.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
 
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
 
@ExtendWith(MockitoExtension.class)
public class UserControllerTest {
 
    @Mock
    private UserService userService;
 
    @InjectMocks
    private UserController userController;
 
    private User testUser;
 
    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
    }
 
    @Test
    void getUserProfile_Success() {
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("test@example.com");
        when(userService.getUserByEmail("test@example.com")).thenReturn(testUser);
 
        ResponseEntity<?> response = userController.getUserProfile(auth);
 
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(testUser, response.getBody());
    }
 
    @Test
    void getUserById_Success() {
        when(userService.getUserById(1L)).thenReturn(testUser);
 
        ResponseEntity<?> response = userController.getUserById(1L);
 
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(testUser, response.getBody());
    }
 
    @Test
    void updateUser_Success() {
        UpdateUserRequest req = new UpdateUserRequest("Jane", "Smith", "http://image.com");
        when(userService.updateUser(1L, "Jane", "Smith", "http://image.com")).thenReturn(testUser);
 
        ResponseEntity<?> response = userController.updateUser(1L, req);
 
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
    }
}
