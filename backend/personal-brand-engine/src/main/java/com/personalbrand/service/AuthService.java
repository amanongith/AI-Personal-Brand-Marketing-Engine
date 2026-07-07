package com.personalbrand.service;

import com.personalbrand.dto.request.LoginRequest;
import com.personalbrand.dto.request.RegisterRequest;
import com.personalbrand.dto.response.JwtResponse;
import com.personalbrand.entity.User;
import com.personalbrand.entity.UserRole;
import com.personalbrand.entity.Profile;
import com.personalbrand.entity.Content;
import com.personalbrand.entity.CalendarEvent;
import com.personalbrand.entity.Analytics;
import com.personalbrand.entity.Engagement;
import com.personalbrand.exception.ValidationException;
import com.personalbrand.repository.UserRepository;
import com.personalbrand.repository.ProfileRepository;
import com.personalbrand.repository.ContentRepository;
import com.personalbrand.repository.CalendarRepository;
import com.personalbrand.repository.AnalyticsRepository;
import com.personalbrand.repository.EngagementRepository;
import com.personalbrand.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final NotificationService notificationService;
    private final ProfileRepository profileRepository;
    private final ContentRepository contentRepository;
    private final CalendarRepository calendarRepository;
    private final AnalyticsRepository analyticsRepository;
    private final EngagementRepository engagementRepository;

    public JwtResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(request.getRole() != null ? request.getRole() : UserRole.USER)
                .emailVerified(false)
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser.getEmail());

        notificationService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFirstName());
        try {
            seedDummyDataForUser(savedUser);
        } catch (Exception e) {
            // Log and tolerate seeding errors to prevent blocking registration
            e.printStackTrace();
        }

        return new JwtResponse(
                token,
                "Bearer",
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getRole().name()
        );
    }

    public JwtResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ValidationException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ValidationException("Invalid email or password");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        try {
            seedDummyDataForUser(user);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new JwtResponse(
                token,
                "Bearer",
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().name()
        );
    }

    public void verifyEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ValidationException("User not found"));
        user.setEmailVerified(true);
        userRepository.save(user);
    }

    private void seedDummyDataForUser(User user) {
        // 1. Profile
        if (profileRepository.findByUserId(user.getId()).isEmpty()) {
            Profile profile = Profile.builder()
                    .user(user)
                    .bio("AI Engineer & SaaS Developer. Building the future of agentic workflows.")
                    .website("https://brandengine.ai")
                    .location("San Francisco, CA")
                    .industry("Technology")
                    .niche("AI & SaaS Development")
                    .personalBrandStatement("Empowering developers to build production-grade agentic AI applications.")
                    .targetAudience("Software engineers, AI enthusiasts, SaaS founders")
                    .coreValues("Open source, continuous learning, shipping fast")
                    .socialLinks("{}")
                    .experienceYears(5)
                    .build();
            profileRepository.save(profile);
        }

        // 2. Content
        if (contentRepository.findByUserId(user.getId()).isEmpty()) {
            Content content1 = Content.builder()
                    .user(user)
                    .title("Why Agentic Workflows Are Replacing Standard RAG")
                    .body("🚀 Why Agentic Workflows Are Quietly Replacing Standard RAG in Production\n\nFor the past year, standard Retrieval-Augmented Generation (RAG) was the default architecture. But it has a major ceiling: it's purely reactive.\n\nHere is how Agentic AI takes it further:\n\n1. Multi-Step Reasoning: Instead of fetching docs once, agents can search, evaluate, refine, and query again if info is missing.\n2. Tool Integration: Agents don't just read; they execute code, call external APIs, and compute math.\n3. Self-Correction: If a query returns garbage, the agent rewrites its parameters and tries a new route.\n\nIn our production tests, transitioning from standard RAG to an agentic loop reduced hallucinations by over 42%.\n\nAre you building standard RAG, or are you moving to agentic setups? Let me know in the comments! 👇\n\n#AI #SoftwareEngineering #AgenticAI #MachineLearning")
                    .platform("LINKEDIN")
                    .status("PUBLISHED")
                    .contentType("educational")
                    .tags("#AI #AgenticAI")
                    .views(1200L)
                    .likes(150L)
                    .shares(30L)
                    .engagementScore(8.2)
                    .publishedTime(LocalDateTime.now().minusDays(2))
                    .build();

            Content content2 = Content.builder()
                    .user(user)
                    .title("Building a personal brand as a software engineer")
                    .body("Most developers think writing code is enough. It's not. If you want to accelerate your career or bootstrap a SaaS, you need to share your learnings in public...\n\n1/ Share your bugs and how you fixed them\n2/ Document your architectural choices\n3/ Write about your failures, not just wins\n\nBuilding in public builds leverage. What are you sharing today?")
                    .platform("TWITTER")
                    .status("PUBLISHED")
                    .contentType("thought-leadership")
                    .tags("#SoftwareEngineering #Branding")
                    .views(850L)
                    .likes(95L)
                    .shares(15L)
                    .engagementScore(6.8)
                    .publishedTime(LocalDateTime.now().minusDays(1))
                    .build();

            Content content3 = Content.builder()
                    .user(user)
                    .title("Weekly AI Newsletter & Trends")
                    .body("Here are the top AI tools and research papers you should look into this week...")
                    .platform("LINKEDIN")
                    .status("SCHEDULED")
                    .contentType("newsletter")
                    .tags("#AI #News")
                    .scheduledTime(LocalDateTime.now().plusDays(2))
                    .build();

            Content content4 = Content.builder()
                    .user(user)
                    .title("SaaS launch post template draft")
                    .body("We are officially launching BrandEngine.AI today! Here is how we built it...")
                    .platform("LINKEDIN")
                    .status("DRAFT")
                    .contentType("promotional")
                    .tags("#SaaS #Launch")
                    .build();

            content1 = contentRepository.save(content1);
            content2 = contentRepository.save(content2);
            contentRepository.save(content3);
            contentRepository.save(content4);

            // 5. Engagement (linked to contents)
            Engagement eng1 = Engagement.builder()
                    .user(user)
                    .content(content1)
                    .engagementType("LIKE")
                    .engagementCount(150L)
                    .platform("LINKEDIN")
                    .engagementDate(LocalDateTime.now().minusDays(2))
                    .build();
            
            Engagement eng2 = Engagement.builder()
                    .user(user)
                    .content(content1)
                    .engagementType("SHARE")
                    .engagementCount(30L)
                    .platform("LINKEDIN")
                    .engagementDate(LocalDateTime.now().minusDays(2))
                    .build();

            Engagement eng3 = Engagement.builder()
                    .user(user)
                    .content(content2)
                    .engagementType("LIKE")
                    .engagementCount(95L)
                    .platform("TWITTER")
                    .engagementDate(LocalDateTime.now().minusDays(1))
                    .build();

            engagementRepository.save(eng1);
            engagementRepository.save(eng2);
            engagementRepository.save(eng3);
        }

        // 3. CalendarEvent
        if (calendarRepository.findByUserIdOrderByStartTimeAsc(user.getId()).isEmpty()) {
            CalendarEvent event1 = CalendarEvent.builder()
                    .user(user)
                    .title("LinkedIn: RAG vs Agentic systems post")
                    .description("Publish the educational post comparing standard RAG vs Agentic workflows.")
                    .startTime(LocalDateTime.now().plusHours(2))
                    .endTime(LocalDateTime.now().plusHours(3))
                    .eventType(com.personalbrand.enums.EventType.CONTENT_POSTING)
                    .platform(com.personalbrand.enums.Platform.LINKEDIN)
                    .status(com.personalbrand.enums.ContentStatus.SCHEDULED)
                    .build();

            CalendarEvent event2 = CalendarEvent.builder()
                    .user(user)
                    .title("Twitter: Dev branding thread")
                    .description("Publish the thought leadership thread on developer personal branding.")
                    .startTime(LocalDateTime.now().plusDays(1).plusHours(4))
                    .endTime(LocalDateTime.now().plusDays(1).plusHours(5))
                    .eventType(com.personalbrand.enums.EventType.CONTENT_POSTING)
                    .platform(com.personalbrand.enums.Platform.TWITTER)
                    .status(com.personalbrand.enums.ContentStatus.SCHEDULED)
                    .build();

            CalendarEvent event3 = CalendarEvent.builder()
                    .user(user)
                    .title("Monthly Analytics & Growth Review")
                    .description("Review follower growth and engagement rates across LinkedIn and Twitter.")
                    .startTime(LocalDateTime.now().plusDays(3).plusHours(2))
                    .endTime(LocalDateTime.now().plusDays(3).plusHours(3))
                    .eventType(com.personalbrand.enums.EventType.ANALYTICS_REVIEW)
                    .build();

            calendarRepository.save(event1);
            calendarRepository.save(event2);
            calendarRepository.save(event3);
        }

        // 4. Analytics
        if (analyticsRepository.findByUserIdOrderByMetricsDateDesc(user.getId()).isEmpty()) {
            Analytics analytic1 = Analytics.builder()
                    .user(user)
                    .platform("LINKEDIN")
                    .followers(1850L)
                    .impressions(12400L)
                    .clicks(540L)
                    .engagements(810L)
                    .engagementRate(6.5)
                    .brandScore(82.0)
                    .metricsDate(LocalDateTime.now())
                    .build();

            Analytics analytic2 = Analytics.builder()
                    .user(user)
                    .platform("TWITTER")
                    .followers(600L)
                    .impressions(5600L)
                    .clicks(120L)
                    .engagements(210L)
                    .engagementRate(3.7)
                    .brandScore(68.0)
                    .metricsDate(LocalDateTime.now())
                    .build();

            analyticsRepository.save(analytic1);
            analyticsRepository.save(analytic2);
        }
    }
}