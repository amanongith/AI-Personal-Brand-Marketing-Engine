package com.personalbrand.service;

import com.personalbrand.entity.Profile;
import com.personalbrand.entity.User;
import com.personalbrand.exception.ResourceNotFoundException;
import com.personalbrand.repository.ProfileRepository;
import com.personalbrand.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public Profile getProfileByUserId(Long userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + userId));
    }

    public Profile createProfile(Long userId, Profile profileRequest) {
        var existing = profileRepository.findByUserId(userId);
        if (existing.isPresent()) {
            return updateProfile(userId, profileRequest);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Profile profile = Profile.builder()
                .user(user)
                .bio(profileRequest.getBio())
                .website(profileRequest.getWebsite())
                .location(profileRequest.getLocation())
                .industry(profileRequest.getIndustry())
                .niche(profileRequest.getNiche())
                .personalBrandStatement(profileRequest.getPersonalBrandStatement())
                .targetAudience(profileRequest.getTargetAudience())
                .coreValues(profileRequest.getCoreValues())
                .socialLinks(profileRequest.getSocialLinks())
                .experienceYears(profileRequest.getExperienceYears())
                .build();

        return profileRepository.save(profile);
    }

    public Profile updateProfile(Long userId, Profile profileRequest) {
        Profile profile = getProfileByUserId(userId);

        if (profileRequest.getBio() != null) profile.setBio(profileRequest.getBio());
        if (profileRequest.getWebsite() != null) profile.setWebsite(profileRequest.getWebsite());
        if (profileRequest.getLocation() != null) profile.setLocation(profileRequest.getLocation());
        if (profileRequest.getIndustry() != null) profile.setIndustry(profileRequest.getIndustry());
        if (profileRequest.getNiche() != null) profile.setNiche(profileRequest.getNiche());
        if (profileRequest.getPersonalBrandStatement() != null)
            profile.setPersonalBrandStatement(profileRequest.getPersonalBrandStatement());
        if (profileRequest.getTargetAudience() != null) profile.setTargetAudience(profileRequest.getTargetAudience());
        if (profileRequest.getCoreValues() != null) profile.setCoreValues(profileRequest.getCoreValues());
        if (profileRequest.getSocialLinks() != null) profile.setSocialLinks(profileRequest.getSocialLinks());
        if (profileRequest.getExperienceYears() != null)
            profile.setExperienceYears(profileRequest.getExperienceYears());

        return profileRepository.save(profile);
    }

    public void deleteProfile(Long userId) {
        Profile profile = getProfileByUserId(userId);
        profileRepository.delete(profile);
    }
}
