package com.personalbrand.service;
 
import com.personalbrand.entity.Profile;
import com.personalbrand.entity.User;
import com.personalbrand.exception.ResourceNotFoundException;
import com.personalbrand.repository.ProfileRepository;
import com.personalbrand.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
 
import java.util.Optional;
 
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
 
@ExtendWith(MockitoExtension.class)
public class ProfileServiceTest {
 
    @Mock
    private ProfileRepository profileRepository;
 
    @Mock
    private UserRepository userRepository;
 
    @InjectMocks
    private ProfileService profileService;
 
    private User testUser;
    private Profile testProfile;
 
    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
 
        testProfile = new Profile();
        testProfile.setId(5L);
        testProfile.setUser(testUser);
        testProfile.setBio("My biography");
        testProfile.setIndustry("Tech");
        testProfile.setNiche("AI");
    }
 
    @Test
    void getProfileByUserId_Success() {
        when(profileRepository.findByUserId(1L)).thenReturn(Optional.of(testProfile));
 
        Profile result = profileService.getProfileByUserId(1L);
 
        assertNotNull(result);
        assertEquals("My biography", result.getBio());
        verify(profileRepository, times(1)).findByUserId(1L);
    }
 
    @Test
    void getProfileByUserId_NotFound_ThrowsException() {
        when(profileRepository.findByUserId(2L)).thenReturn(Optional.empty());
 
        assertThrows(ResourceNotFoundException.class, () -> profileService.getProfileByUserId(2L));
        verify(profileRepository, times(1)).findByUserId(2L);
    }
 
    @Test
    void createProfile_New_Success() {
        when(profileRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(profileRepository.save(any(Profile.class))).thenAnswer(invocation -> invocation.getArgument(0));
 
        Profile result = profileService.createProfile(1L, testProfile);
 
        assertNotNull(result);
        assertEquals(testUser, result.getUser());
        assertEquals("My biography", result.getBio());
    }
 
    @Test
    void createProfile_Existing_UpdatesSuccess() {
        when(profileRepository.findByUserId(1L)).thenReturn(Optional.of(testProfile));
        when(profileRepository.save(any(Profile.class))).thenAnswer(invocation -> invocation.getArgument(0));
 
        Profile request = new Profile();
        request.setBio("Updated bio");
 
        Profile result = profileService.createProfile(1L, request);
 
        assertNotNull(result);
        assertEquals("Updated bio", result.getBio());
    }
}
