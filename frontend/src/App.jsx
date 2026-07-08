import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus, 
  Sparkles, 
  Send, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Link as LinkIcon,
  Info,
  Sliders,
  TrendingUp,
  Share2,
  ThumbsUp,
  Eye,
  MessageSquare
} from 'lucide-react';

const DEFAULT_BACKEND_PORT = '8080';
const DEFAULT_USER_ID = '1';

function App() {
  // Navigation & Connection State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backendPort, setBackendPort] = useState(() => localStorage.getItem('backend_port') || DEFAULT_BACKEND_PORT);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [notifications, setNotifications] = useState([]);
  
  // Auth State
  const [userId, setUserId] = useState(() => localStorage.getItem('user_id') || DEFAULT_USER_ID);
  const [token, setToken] = useState(() => localStorage.getItem('jwt_token') || '');
  const [userFirstName, setUserFirstName] = useState(() => localStorage.getItem('user_first_name') || 'John');
  const [userLastName, setUserLastName] = useState(() => localStorage.getItem('user_last_name') || 'Doe');
  const [userProfileImage, setUserProfileImage] = useState(() => localStorage.getItem('user_profile_image') || '');
  const [emailVerified, setEmailVerified] = useState(false);
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('user_email') || '');
  const [userProfile, setUserProfile] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'demo'
  const [authEmail, setAuthEmail] = useState('john.doe@example.com');
  const [authPassword, setAuthPassword] = useState('Password123!');
  const [authFirstName, setAuthFirstName] = useState('John');
  const [authLastName, setAuthLastName] = useState('Doe');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState({
    totalPosts: 12,
    upcomingPosts: 3,
    draftPosts: 5,
    totalEngagement: 1420,
    followers: 2450,
    engagementRate: 5.8,
    brandScore: 78
  });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    bio: 'Tech enthusiast and entrepreneur building the future of AI. Sharing lessons on startup scaling and SaaS architecture.',
    website: 'https://johndoe.dev',
    location: 'San Francisco, CA',
    industry: 'Software / Technology',
    niche: 'AI & SaaS Development',
    personalBrandStatement: 'Helping tech founders build scale-ready applications and leverage AI for creator productivity.',
    targetAudience: 'Early-stage tech founders, software developers, and product managers.',
    coreValues: 'Consistency, transparency, and innovation.',
    socialLinks: 'linkedin:johndoe,twitter:johndoe_ai',
    experienceYears: 8
  });
  const [profileStatus, setProfileStatus] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzingProfile, setAnalyzingProfile] = useState(false);

  // Content Generator State
  const [genPlatform, setGenPlatform] = useState('linkedin');
  const [genTone, setGenTone] = useState('professional');
  const [genContentType, setGenContentType] = useState('educational');
  const [genTopic, setGenTopic] = useState('Why agentic workflows are replacing standard RAG applications in production');
  const [genInstructions, setGenInstructions] = useState('Include 3 key takeaways and a question at the end to drive comments.');
  const [generatingContent, setGeneratingContent] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [contentStatus, setContentStatus] = useState('');

  // Calendar State
  const [calendarEvents, setCalendarEvents] = useState([
    { id: 1, title: 'LinkedIn: RAG vs Agentic systems post', startTime: '2026-07-08T09:00', endTime: '2026-07-08T10:00', eventType: 'CONTENT_POSTING', platform: 'LINKEDIN', status: 'SCHEDULED' },
    { id: 2, title: 'Meeting: Founder sync & networking', startTime: '2026-07-09T14:00', endTime: '2026-07-09T15:00', eventType: 'MEETING', platform: null, status: 'PUBLISHED' },
    { id: 3, title: 'X Thread: 5 tools for developers in 2026', startTime: '2026-07-10T10:00', endTime: '2026-07-10T11:00', eventType: 'CONTENT_POSTING', platform: 'TWITTER', status: 'DRAFT' },
    { id: 4, title: 'Review: Social analytics check', startTime: '2026-07-12T17:00', endTime: '2026-07-12T18:00', eventType: 'ANALYTICS_REVIEW', platform: null, status: 'SCHEDULED' }
  ]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    eventType: 'CONTENT_POSTING',
    platform: 'LINKEDIN',
    status: 'DRAFT'
  });
  const [eventStatus, setEventStatus] = useState('');

  // Analytics State
  const [analyticsList, setAnalyticsList] = useState([
    { platform: 'linkedin', followers: 1850, impressions: 12400, clicks: 540, engagements: 810, engagementRate: 6.5, brandScore: 82 },
    { platform: 'twitter', followers: 600, impressions: 5600, clicks: 120, engagements: 210, engagementRate: 3.7, brandScore: 68 }
  ]);

  // Drafts & Contents List
  const [contentsList, setContentsList] = useState([]);

  // Connected Social Accounts
  const [connectedAccounts, setConnectedAccounts] = useState([]);

  // Inline scheduling helpers
  const [schedulingItemId, setSchedulingItemId] = useState(null);
  const [scheduledTimeInput, setScheduledTimeInput] = useState('');

  // Base URL
  const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? `http://${window.location.hostname}:${backendPort}`
    : '';

  // Helper for fetch requests
  const apiFetch = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `API Error: ${response.status}`);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json().catch(() => null);
    }
    return response.text();
  };

  // Check Backend Connection
  const checkConnection = async () => {
    setBackendStatus('checking');
    try {
      // Use v3/api-docs as a public endpoint to check connectivity
      const response = await fetch(`${baseUrl}/v3/api-docs`);
      if (response.ok) {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch (err) {
      setBackendStatus('offline');
    }
  };

  // Fetch all data if online & logged in
  const loadAllData = async () => {
    if (backendStatus !== 'online' || !token || token === 'mock-jwt-token-demo') return;

    // 0. User Account Info
    try {
      const userDetails = await apiFetch(`/api/users/${userId}`);
      if (userDetails) {
        setUserFirstName(userDetails.firstName || 'John');
        setUserLastName(userDetails.lastName || 'Doe');
        setUserProfileImage(userDetails.profileImage || '');
        setEmailVerified(userDetails.emailVerified || false);
        setUserEmail(userDetails.email || '');
      }
    } catch (e) {
      console.warn("Failed to load user account details:", e);
    }

    // 1. Dashboard
    try {
      const dashData = await apiFetch(`/api/dashboard/${userId}`);
      if (dashData) setDashboardData(dashData);
    } catch (e) {
      console.warn("Failed to load dashboard data:", e);
    }

    // 2. Profile
    try {
      const prof = await apiFetch(`/api/profiles/${userId}`);
      if (prof) setProfileForm(prof);
    } catch (e) {
      console.warn("Failed to load profile details:", e);
    }

    // 3. Calendar
    try {
      const events = await apiFetch(`/api/calendar/${userId}/all`);
      if (events && events.length > 0) setCalendarEvents(events);
    } catch (e) {
      console.warn("Failed to load calendar events:", e);
    }

    // 4. Content
    try {
      const contents = await apiFetch(`/api/content/${userId}`);
      if (contents) setContentsList(contents);
    } catch (e) {
      console.warn("Failed to load content list:", e);
    }

    // 5. Analytics
    try {
      const analytics = await apiFetch(`/api/analytics/${userId}`);
      if (analytics && analytics.length > 0) setAnalyticsList(analytics);
    } catch (e) {
      console.warn("Failed to load analytics:", e);
    }

    // 6. Connected Social Accounts
    try {
      const accounts = await apiFetch(`/api/oauth/accounts`);
      if (accounts) setConnectedAccounts(accounts);
    } catch (e) {
      console.warn("Failed to load connected social accounts:", e);
    }
  };

  useEffect(() => {
    checkConnection();
  }, [backendPort]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connectedPlatform = params.get('connected');
    const oauthErrorParam = params.get('error');

    if (connectedPlatform) {
      setNotifications(prev => [
        { id: Date.now(), type: 'PUBLISH', message: `Successfully connected your ${connectedPlatform.toUpperCase()} account!` },
        ...prev
      ]);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      if (backendStatus === 'online' && token && token !== 'mock-jwt-token-demo') {
        loadAllData();
      }
    }
    if (oauthErrorParam) {
      setNotifications(prev => [
        { id: Date.now(), type: 'ERROR', message: `OAuth connection failed: ${oauthErrorParam}` },
        ...prev
      ]);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [backendStatus, token]);

  useEffect(() => {
    if (backendStatus === 'online' && token && token !== 'mock-jwt-token-demo') {
      loadAllData();
    }
  }, [backendStatus, token, userId]);

  useEffect(() => {
    if (backendStatus !== 'online') return;

    const wsUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? `ws://${window.location.hostname}:${backendPort}/ws-notifications`
      : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/ws-notifications`;
    console.log("Connecting to WebSocket: ", wsUrl);
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received WebSocket notification: ", data);
        if (data.message) {
          setNotifications(prev => [
            { id: Date.now(), type: data.type || 'INFO', message: data.message },
            ...prev
          ]);
          loadAllData();
        }
      } catch (err) {
        console.error("Error parsing WS message:", err);
      }
    };

    socket.onerror = (error) => {
      console.warn("WebSocket Connection Error:", error);
    };

    return () => {
      socket.close();
    };
  }, [backendStatus, backendPort, token]);

  // Auth Handlers
  const handleLogin = async (e) => {
    e?.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      if (data && data.token) {
        setToken(data.token);
        localStorage.setItem('jwt_token', data.token);
        const resolvedUserId = data.id ? String(data.id) : (data.userId ? String(data.userId) : DEFAULT_USER_ID);
        setUserId(resolvedUserId);
        localStorage.setItem('user_id', resolvedUserId);
        
        const fName = data.firstName || 'John';
        const lName = data.lastName || 'Doe';
        const email = data.email || '';
        const imgUrl = data.profileImage || '';
        setUserFirstName(fName);
        setUserLastName(lName);
        setUserEmail(email);
        setUserProfileImage(imgUrl);
        localStorage.setItem('user_first_name', fName);
        localStorage.setItem('user_last_name', lName);
        localStorage.setItem('user_email', email);
        localStorage.setItem('user_profile_image', imgUrl);

        setAuthSuccess('Logged in successfully!');
        setAuthMode('demo'); // Allow entering main dashboard
      }
    } catch (err) {
      setAuthError(err.message || 'Login failed. Make sure your credentials are correct.');
    }
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    try {
      await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ 
          email: authEmail, 
          password: authPassword,
          firstName: authFirstName,
          lastName: authLastName,
          role: 'USER'
        })
      });
      setAuthSuccess('Registration successful! Please log in.');
      setAuthMode('login');
    } catch (err) {
      setAuthError(err.message || 'Registration failed.');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_first_name');
    localStorage.removeItem('user_last_name');
    localStorage.removeItem('user_profile_image');
    localStorage.removeItem('user_email');
    setUserFirstName('John');
    setUserLastName('Doe');
    setUserProfileImage('');
    setUserEmail('');
    setEmailVerified(false);
    setUserId(DEFAULT_USER_ID);
    setAuthMode('login');
  };

  const [accountStatus, setAccountStatus] = useState(''); // '', 'saving', 'success', 'error'
  const [verificationStatus, setVerificationStatus] = useState(''); // '', 'verifying', 'success', 'error'

  const handleSaveAccountSettings = async (e) => {
    e.preventDefault();
    setAccountStatus('saving');
    try {
      if (backendStatus === 'online' && token && token !== 'mock-jwt-token-demo') {
        const updatedUser = await apiFetch(`/api/users/${userId}`, {
          method: 'PUT',
          body: JSON.stringify({
            firstName: userFirstName,
            lastName: userLastName,
            profileImage: userProfileImage
          })
        });
        if (updatedUser) {
          setUserFirstName(updatedUser.firstName || userFirstName);
          setUserLastName(updatedUser.lastName || userLastName);
          setUserProfileImage(updatedUser.profileImage || userProfileImage);
          localStorage.setItem('user_first_name', updatedUser.firstName || userFirstName);
          localStorage.setItem('user_last_name', updatedUser.lastName || userLastName);
          localStorage.setItem('user_profile_image', updatedUser.profileImage || userProfileImage);
        }
        setAccountStatus('success');
      } else {
        setTimeout(() => {
          localStorage.setItem('user_first_name', userFirstName);
          localStorage.setItem('user_last_name', userLastName);
          localStorage.setItem('user_profile_image', userProfileImage);
          setAccountStatus('success');
        }, 800);
      }
    } catch (err) {
      console.error(err);
      setAccountStatus('error');
    }
  };

  const handleVerifyEmail = async () => {
    setVerificationStatus('verifying');
    try {
      if (backendStatus === 'online' && token && token !== 'mock-jwt-token-demo') {
        await apiFetch(`/api/auth/verify-email?email=${encodeURIComponent(userEmail)}`, {
          method: 'POST'
        });
        setEmailVerified(true);
        setVerificationStatus('success');
      } else {
        setTimeout(() => {
          setEmailVerified(true);
          setVerificationStatus('success');
        }, 800);
      }
    } catch (err) {
      console.error(err);
      setVerificationStatus('error');
    }
  };

  // Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileStatus('saving');
    try {
      if (backendStatus === 'online' && token && token !== 'mock-jwt-token-demo') {
        await apiFetch(`/api/profiles/${userId}`, {
          method: 'POST',
          body: JSON.stringify(profileForm)
        });
        setProfileStatus('success');
      } else {
        // Mock success
        setTimeout(() => setProfileStatus('success'), 600);
      }
    } catch (err) {
      setProfileStatus('error');
    }
  };

  // AI Profile Analysis
  const handleRunAnalysis = async () => {
    setAnalyzingProfile(true);
    try {
      if (backendStatus === 'online' && token && token !== 'mock-jwt-token-demo') {
        const data = await apiFetch(`/api/ai/${userId}/analyze-profile`);
        let parsed = data;
        if (typeof data === 'string') {
          try {
            parsed = JSON.parse(data);
          } catch (e) {
            // Keep as raw string (e.g. plain text / markdown insights)
          }
        }
        setAiAnalysis(parsed);
      } else {
        // Mock AI suggestions
        setTimeout(() => {
          setAiAnalysis([
            { title: "Optimize Post Scheduling", priority: "HIGH", reason: "Current posting consistency is 1.5 posts per week. Recommended frequency is 4 posts/week for maximum LinkedIn visibility." },
            { title: "Define Personal Brand Narrative", priority: "HIGH", reason: "Your profile niche is wide. Focus 70% of content on 'AI engineering' and 30% on 'SaaS business lessons' to build authority faster." },
            { title: "Leverage Speaking Gigs", priority: "MEDIUM", reason: "Upcoming calendar shows speaking at a conference. Turn this into a multi-part X/Twitter thread to capture audience growth." },
            { title: "Implement Engaging CTAs", priority: "MEDIUM", reason: "Your drafts lack calls to action. Prompt comments by asking open-ended technical questions." }
          ]);
          setAnalyzingProfile(false);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setAnalyzingProfile(false);
    }
  };

  useEffect(() => {
    if (aiAnalysis) setAnalyzingProfile(false);
  }, [aiAnalysis]);

  // AI Post Generator
  const handleGenerateContent = async (e) => {
    e.preventDefault();
    setGeneratingContent(true);
    setGeneratedOutput('');
    try {
      if (backendStatus === 'online' && token && token !== 'mock-jwt-token-demo') {
        const data = await apiFetch(`/api/ai/${userId}/generate-post`, {
          method: 'POST',
          body: JSON.stringify({
            platform: genPlatform.toUpperCase(),
            topic: genTopic,
            tone: genTone,
            contentType: genContentType,
            additionalInstructions: genInstructions
          })
        });
        setGeneratedOutput(data || 'No response from AI.');
        setGeneratedTitle(genTopic);
        setGeneratingContent(false);
      } else {
        // Mock generation
        setTimeout(() => {
          let output = '';
          if (genPlatform === 'linkedin') {
            output = `🚀 Why Agentic Workflows Are Quietly Replacing Standard RAG in Production\n\nFor the past year, standard Retrieval-Augmented Generation (RAG) was the default architecture. But it has a major ceiling: it's purely reactive.\n\nHere is how Agentic AI takes it further:\n\n1. Multi-Step Reasoning: Instead of fetching docs once, agents can search, evaluate, refine, and query again if info is missing.\n2. Tool Integration: Agents don't just read; they execute code, call external APIs, and compute math.\n3. Self-Correction: If a query returns garbage, the agent rewrites its parameters and tries a new route.\n\nIn our production tests, transitioning from standard RAG to an agentic loop reduced hallucinations by over 42%.\n\nAre you building standard RAG, or are you moving to agentic setups? Let me know in the comments! 👇\n\n#AI #SoftwareEngineering #AgenticAI #MachineLearning`;
          } else if (genPlatform === 'twitter') {
            output = `1/ RAG is dead. Well, standard RAG at least. 💀\n\nIn production, we are seeing a massive migration toward Agentic Workflows. Here is why the old document lookup isn't enough anymore. 👇\n\n2/ Standard RAG is purely reactive. It takes your query, does a vector search, and pushes it to the LLM. It gets one shot. If the search returns irrelevant fragments, you get a hallucination.\n\n3/ Agentic workflows add a loop. The agent can:\n• Check search quality\n• Query multiple sources\n• Evaluate its own output\n• Run tests\n\n4/ The result? Massive gains in accuracy. In our tests, switching to an agentic loop cut hallucinations by 42%.\n\n5/ What are you building right now? Standard RAG or agents? Drop your thoughts below!`;
          } else {
            output = `Struggling to build reliable AI applications? 🤖\n\nStandard RAG (Retrieval-Augmented Generation) was a great starting point, but it's too reactive for complex business logics. That's why we're moving to Agentic Workflows.\n\nAgentic AI has loops, reasoning paths, and tool access. It doesn't just retrieve; it decides, verifies, and executes.\n\nSwipe to see our production comparison matrix! ➡️\n\n#aimarketing #aipost #saasfounder #agenticai #softwareengineer #techcreator`;
          }
          setGeneratedOutput(output);
          setGeneratedTitle(genTopic);
          setGeneratingContent(false);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setGeneratedOutput('Failed to generate content. Verify API key and backend configuration.');
      setGeneratingContent(false);
    }
  };

  // Save Content Draft
  const handleSaveDraft = async () => {
    setContentStatus('saving');
    try {
      const contentPayload = {
        title: generatedTitle || genTopic,
        body: generatedOutput,
        platform: genPlatform.toUpperCase(),
        status: 'DRAFT',
        contentType: genContentType,
        tags: genPlatform === 'linkedin' ? '#AI #AgenticAI' : '#Tech'
      };

      if (backendStatus === 'online' && token && token !== 'mock-jwt-token-demo') {
        await apiFetch('/api/content', {
          method: 'POST',
          body: JSON.stringify(contentPayload)
        });
        setContentStatus('success');
        loadAllData();
      } else {
        setTimeout(() => {
          setContentsList(prev => [
            { id: Date.now(), ...contentPayload, createdAt: new Date().toISOString() },
            ...prev
          ]);
          setContentStatus('success');
        }, 600);
      }
    } catch (err) {
      setContentStatus('error');
    }
  };

  // Add Calendar Event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    setEventStatus('saving');
    try {
      const payload = {
        title: newEvent.title,
        description: newEvent.description,
        startTime: newEvent.startTime,
        endTime: newEvent.endTime,
        eventType: newEvent.eventType,
        platform: newEvent.eventType === 'CONTENT_POSTING' ? newEvent.platform : null,
        status: newEvent.status
      };

      if (backendStatus === 'online' && token && token !== 'mock-jwt-token-demo') {
        await apiFetch(`/api/calendar/${userId}`, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        setEventStatus('success');
        setNewEvent({ title: '', description: '', startTime: '', endTime: '', eventType: 'CONTENT_POSTING', platform: 'LINKEDIN', status: 'DRAFT' });
        loadAllData();
      } else {
        setTimeout(() => {
          setCalendarEvents(prev => [
            { id: Date.now(), ...payload },
            ...prev
          ]);
          setEventStatus('success');
          setNewEvent({ title: '', description: '', startTime: '', endTime: '', eventType: 'CONTENT_POSTING', platform: 'LINKEDIN', status: 'DRAFT' });
        }, 600);
      }
    } catch (err) {
      setEventStatus('error');
    }
  };

  // Handle Event Click (suggestions generator)
  const handleEventClick = (event) => {
    setActiveTab('generator');
    setGenTopic(`Post about ${event.title}`);
    setGenInstructions(`This post is inspired by the event on my calendar: ${event.title}. ${event.description || ''}`);
  };

  // Social OAuth & Connections handlers
  const handleConnectSocial = async (platform) => {
    try {
      if (backendStatus === 'online' && token && token !== 'mock-jwt-token-demo') {
        const frontendOrigin = window.location.origin;
        const res = await apiFetch(`/api/oauth/connect/${platform}?frontendOrigin=${encodeURIComponent(frontendOrigin)}`);
        if (res && res.redirectUrl) {
          window.location.href = res.redirectUrl;
        }
      } else {
        // Mock connection in demo mode
        setTimeout(() => {
          const newAccount = {
            id: Date.now(),
            platform: platform.toUpperCase(),
            username: `Mock User (${platform})`,
            profileImageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
            socialAccountId: `mock_${platform}_id`
          };
          setConnectedAccounts(prev => [...prev, newAccount]);
          setNotifications(prev => [
            { id: Date.now(), type: 'PUBLISH', message: `Successfully connected Mock ${platform.toUpperCase()} account!` },
            ...prev
          ]);
        }, 800);
      }
    } catch (err) {
      console.error("Failed to connect social account:", err);
      setNotifications(prev => [
        { id: Date.now(), type: 'ERROR', message: `Connection failed: ${err.message}` },
        ...prev
      ]);
    }
  };

  const handleDisconnectSocial = async (platform) => {
    try {
      if (backendStatus === 'online' && token && token !== 'mock-jwt-token-demo') {
        await apiFetch(`/api/oauth/disconnect/${platform}`, {
          method: 'DELETE'
        });
        setConnectedAccounts(prev => prev.filter(acc => acc.platform !== platform.toUpperCase()));
        setNotifications(prev => [
          { id: Date.now(), type: 'INFO', message: `Disconnected ${platform.toUpperCase()} account.` },
          ...prev
        ]);
      } else {
        // Mock disconnect in demo mode
        setConnectedAccounts(prev => prev.filter(acc => acc.platform !== platform.toUpperCase()));
        setNotifications(prev => [
          { id: Date.now(), type: 'INFO', message: `Disconnected Mock ${platform.toUpperCase()} account.` },
          ...prev
        ]);
      }
    } catch (err) {
      console.error("Failed to disconnect social account:", err);
    }
  };

  const handlePublishImmediate = async (contentId) => {
    try {
      if (backendStatus === 'online' && token && token !== 'mock-jwt-token-demo') {
        const res = await apiFetch(`/api/oauth/publish/${contentId}`, {
          method: 'POST'
        });
        if (res && res.success) {
          setNotifications(prev => [
            { id: Date.now(), type: 'PUBLISH', message: `Post successfully published!` },
            ...prev
          ]);
          loadAllData();
        }
      } else {
        // Mock publish in demo mode
        setTimeout(() => {
          setContentsList(prev => prev.map(item => 
            item.id === contentId 
              ? { ...item, status: 'PUBLISHED', publishedTime: new Date().toISOString() }
              : item
          ));
          setNotifications(prev => [
            { id: Date.now(), type: 'PUBLISH', message: `Successfully published post (Demo)!` },
            ...prev
          ]);
        }, 800);
      }
    } catch (err) {
      console.error("Failed to publish post:", err);
      setNotifications(prev => [
        { id: Date.now(), type: 'ERROR', message: `Publishing failed: ${err.message}` },
        ...prev
      ]);
    }
  };

  const handleSchedulePost = async (contentId, scheduledTimeStr) => {
    try {
      if (backendStatus === 'online' && token && token !== 'mock-jwt-token-demo') {
        await apiFetch(`/api/content/${contentId}`, {
          method: 'PUT',
          body: JSON.stringify({
            status: 'SCHEDULED',
            scheduledTime: scheduledTimeStr
          })
        });
        setNotifications(prev => [
          { id: Date.now(), type: 'INFO', message: `Post successfully scheduled!` },
          ...prev
        ]);
        loadAllData();
      } else {
        // Mock schedule in demo mode
        setContentsList(prev => prev.map(item => 
          item.id === contentId 
            ? { ...item, status: 'SCHEDULED', scheduledTime: scheduledTimeStr }
            : item
        ));
        setNotifications(prev => [
          { id: Date.now(), type: 'INFO', message: `Post successfully scheduled (Demo)!` },
          ...prev
        ]);
      }
    } catch (err) {
      console.error("Failed to schedule post:", err);
      setNotifications(prev => [
        { id: Date.now(), type: 'ERROR', message: `Scheduling failed: ${err.message}` },
        ...prev
      ]);
    }
  };

  const handleDeleteContent = async (contentId) => {
    try {
      if (backendStatus === 'online' && token && token !== 'mock-jwt-token-demo') {
        await apiFetch(`/api/content/${contentId}`, {
          method: 'DELETE'
        });
        setNotifications(prev => [
          { id: Date.now(), type: 'INFO', message: `Post deleted successfully.` },
          ...prev
        ]);
        loadAllData();
      } else {
        // Mock delete in demo mode
        setContentsList(prev => prev.filter(item => item.id !== contentId));
        setNotifications(prev => [
          { id: Date.now(), type: 'INFO', message: `Post deleted (Demo).` },
          ...prev
        ]);
      }
    } catch (err) {
      console.error("Failed to delete content:", err);
    }
  };

  const handleRevertToDraft = async (contentId) => {
    try {
      if (backendStatus === 'online' && token && token !== 'mock-jwt-token-demo') {
        await apiFetch(`/api/content/${contentId}`, {
          method: 'PUT',
          body: JSON.stringify({
            status: 'DRAFT',
            scheduledTime: null
          })
        });
        setNotifications(prev => [
          { id: Date.now(), type: 'INFO', message: `Post status changed back to Draft.` },
          ...prev
        ]);
        loadAllData();
      } else {
        // Mock revert in demo mode
        setContentsList(prev => prev.map(item => 
          item.id === contentId 
            ? { ...item, status: 'DRAFT', scheduledTime: null }
            : item
        ));
      }
    } catch (err) {
      console.error("Failed to revert content to draft:", err);
    }
  };

  // Auto-connect on startup
  useEffect(() => {
    if (backendStatus === 'online') {
      // Attempt login or fetch profile
    }
  }, [backendStatus]);

  // Demo bypass
  const handleEnterDemo = () => {
    setToken('mock-jwt-token-demo');
    setUserId('1');
    setAuthMode('demo');
    setAuthSuccess('Demo Mode Activated!');
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand-container">
          <div className="brand-icon">
            <Sparkles size={22} />
          </div>
          <span className="brand-name">BrandEngine.AI</span>
        </div>

        {token && (
          <ul className="nav-menu">
            <li>
              <button 
                className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </button>
            </li>
            <li>
              <button 
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={18} />
                Profile & Analysis
              </button>
            </li>
            <li>
              <button 
                className={`nav-item ${activeTab === 'generator' ? 'active' : ''}`}
                onClick={() => setActiveTab('generator')}
              >
                <FileText size={18} />
                AI Generator
              </button>
            </li>
            <li>
              <button 
                className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
                onClick={() => setActiveTab('calendar')}
              >
                <Calendar size={18} />
                Calendar & Schedule
              </button>
            </li>
            <li>
              <button 
                className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 size={18} />
                Analytics
              </button>
            </li>
            <li>
              <button 
                className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings size={18} />
                Server Settings
              </button>
            </li>
          </ul>
        )}

        <div className="sidebar-footer">
          {token ? (
            <div className="user-badge">
              {userProfileImage ? (
                <img src={userProfileImage} alt="Avatar" className="user-avatar" style={{ objectFit: 'cover' }} />
              ) : (
                <div className="user-avatar">
                  {userFirstName.substring(0, 1).toUpperCase()}{userLastName.substring(0, 1).toUpperCase()}
                </div>
              )}
              <div className="user-details">
                <span className="user-name">{userFirstName} {userLastName}</span>
                <span className="user-role">Creator Brand</span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '6px', minWidth: 'auto', marginLeft: 'auto' }} title="Log out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <span className="user-role" style={{ display: 'block', marginBottom: '8px' }}>Please Sign In</span>
              <button onClick={() => { setAuthMode('login'); }} className="btn btn-secondary" style={{ width: '100%' }}>Login / Register</button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        
        {/* Connection Header */}
        <header className="header-container">
          <div>
            <h1 className="header-title">
              {activeTab === 'dashboard' && 'Creator Dashboard'}
              {activeTab === 'profile' && 'Profile Intelligence'}
              {activeTab === 'generator' && 'AI Content Engine'}
              {activeTab === 'calendar' && 'Calendar Automation'}
              {activeTab === 'analytics' && 'Growth Analytics'}
              {activeTab === 'settings' && 'Connection Settings'}
            </h1>
            <p className="header-subtitle">
              {activeTab === 'dashboard' && 'Overview of your personal brand metrics, notifications, and scheduled posts.'}
              {activeTab === 'profile' && 'Analyze your niche, core values, and receive AI-driven branding recommendations.'}
              {activeTab === 'generator' && 'Auto-generate platform-specific hooks, copy, and hashtags in seconds.'}
              {activeTab === 'calendar' && 'Sync your events and meetings to automatically schedule social content.'}
              {activeTab === 'analytics' && 'Track impressions, follower counts, and post engagement rates.'}
              {activeTab === 'settings' && 'Configure local API port settings and manage database credentials.'}
            </p>
          </div>

          <div className="flex-align-center">
            {backendStatus === 'online' ? (
              <span className="status-badge">
                <CheckCircle2 size={14} />
                Online (Port {backendPort})
              </span>
            ) : (
              <span className="status-badge offline">
                <AlertCircle size={14} />
                Demo Mode (Offline)
              </span>
            )}
          </div>
        </header>

        {/* Real-time Alerts */}
        {notifications.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            {notifications.map(note => (
              <div 
                key={note.id} 
                style={{ 
                  backgroundColor: 'rgba(168, 85, 247, 0.1)', 
                  border: '1px solid rgba(168, 85, 247, 0.3)', 
                  padding: '12px 20px', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={16} style={{ color: 'var(--accent-purple)' }} />
                  <span className="font-14"><strong>[REAL-TIME ALERT]</strong> {note.message}</span>
                </div>
                <button 
                  onClick={() => setNotifications(prev => prev.filter(n => n.id !== note.id))}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}
                >
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Authentication Flow / Guest Screen */}
        {!token && (
          <div style={{ maxWidth: '480px', margin: '60px auto 0' }} className="card accent">
            <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Personal Brand Marketing Engine</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Create posts, analyze niches, and schedule events with agentic workflows.
            </p>

            {authError && (
              <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '12px', borderRadius: '8px', color: '#f43f5e', fontSize: '13px', display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{authError}</span>
              </div>
            )}
            
            {authSuccess && (
              <div style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)', border: '1px solid rgba(20, 184, 166, 0.3)', padding: '12px', borderRadius: '8px', color: 'var(--accent-teal)', fontSize: '13px', display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                <span>{authSuccess}</span>
              </div>
            )}

            {authMode === 'login' ? (
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '16px' }}>
                  Sign In
                </button>
                <div style={{ textAlign: 'center', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
                  <button type="button" onClick={() => setAuthMode('register')} style={{ background: 'none', border: 'none', color: 'var(--accent-purple)', cursor: 'pointer', fontWeight: 600 }}>Register</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" value={authFirstName} onChange={(e) => setAuthFirstName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" value={authLastName} onChange={(e) => setAuthLastName(e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '16px' }}>
                  Register Account
                </button>
                <div style={{ textAlign: 'center', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
                  <button type="button" onClick={() => setAuthMode('login')} style={{ background: 'none', border: 'none', color: 'var(--accent-purple)', cursor: 'pointer', fontWeight: 600 }}>Login</button>
                </div>
              </form>
            )}

            <div style={{ borderTop: '1px solid var(--border-color)', margin: '24px 0 16px', paddingTop: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>Want to try out the interface without running the backend?</p>
              <button onClick={handleEnterDemo} className="btn btn-secondary" style={{ width: '100%' }}>
                Enter Demo / Offline Mode
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Dashboard */}
        {token && activeTab === 'dashboard' && (
          <div>
            {/* Stats Metrics */}
            <div className="stats-grid">
              <div className="card accent">
                <div className="card-header">
                  <span>Audience Reach</span>
                  <div className="card-icon blue"><TrendingUp size={16} /></div>
                </div>
                <div className="card-value">{(dashboardData?.followers ?? 0).toLocaleString()}</div>
                <div className="card-change up">
                  <span>+12.4% this month</span>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span>Engagement Rate</span>
                  <div className="card-icon teal"><ThumbsUp size={16} /></div>
                </div>
                <div className="card-value">{dashboardData?.engagementRate ?? 0}%</div>
                <div className="card-change up">
                  <span>+0.8% vs last week</span>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span>Total Engagement</span>
                  <div className="card-icon purple"><Share2 size={16} /></div>
                </div>
                <div className="card-value">{(dashboardData?.totalEngagement ?? 0).toLocaleString()}</div>
                <div className="card-change up">
                  <span>+342 engagements</span>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span>Brand Equity Score</span>
                  <div className="card-icon purple"><Sparkles size={16} /></div>
                </div>
                <div className="card-value">{dashboardData?.brandScore ?? 0}/100</div>
                <div className="card-change up">
                  <span>Elite Authority Tier</span>
                </div>
              </div>
            </div>

            {/* Middle Grid */}
            <div className="dashboard-content-grid">
              {/* Left Side: Content Queue */}
              <div className="card">
                <div className="flex-between margin-b-24">
                  <h3>Interactive Content Queue</h3>
                  <button onClick={() => setActiveTab('generator')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                    <Plus size={14} />
                    Generate Content
                  </button>
                </div>

                <div className="list-container">
                  {Array.isArray(contentsList) && contentsList.length > 0 ? (
                    contentsList.map(item => (
                      <div className="list-item" key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', alignItems: 'stretch' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div className="item-info" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span className={`platform-badge ${item.platform?.toLowerCase() || 'linkedin'}`} style={{ margin: 0, minWidth: '85px', textAlign: 'center' }}>
                              {item.platform || 'LINKEDIN'}
                            </span>
                            <div>
                              <span className="item-title" style={{ fontWeight: 600, fontSize: '14px' }}>{item.title}</span>
                              <div className="item-meta" style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                {item.status === 'PUBLISHED' && `Published • ${new Date(item.publishedTime).toLocaleString()}`}
                                {item.status === 'SCHEDULED' && `Scheduled • ${new Date(item.scheduledTime).toLocaleString()}`}
                                {item.status === 'DRAFT' && 'Draft • Ready to publish'}
                              </div>
                            </div>
                          </div>
                          <span className={`item-status ${item.status?.toLowerCase() || 'draft'}`}>
                            {item.status || 'DRAFT'}
                          </span>
                        </div>

                        {item.body && (
                          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', backgroundColor: 'rgba(255,255,255,0.01)', padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)', whiteSpace: 'pre-wrap', maxHeight: '100px', overflowY: 'auto' }}>
                            {item.body}
                          </div>
                        )}

                        {schedulingItemId === item.id && (
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Choose Time:</span>
                            <input 
                              type="datetime-local" 
                              value={scheduledTimeInput} 
                              onChange={(e) => setScheduledTimeInput(e.target.value)} 
                              style={{ padding: '6px 10px', fontSize: '12px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                            />
                            <button 
                              onClick={() => {
                                if (scheduledTimeInput) {
                                  handleSchedulePost(item.id, scheduledTimeInput);
                                  setSchedulingItemId(null);
                                  setScheduledTimeInput('');
                                }
                              }} 
                              className="btn btn-primary" 
                              style={{ padding: '6px 12px', fontSize: '11px' }}
                            >
                              Confirm
                            </button>
                            <button 
                              onClick={() => {
                                setSchedulingItemId(null);
                                setScheduledTimeInput('');
                              }} 
                              className="btn btn-secondary" 
                              style={{ padding: '6px 12px', fontSize: '11px', background: 'transparent' }}
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '8px' }}>
                          {item.status === 'DRAFT' && schedulingItemId !== item.id && (
                            <>
                              <button 
                                onClick={() => handlePublishImmediate(item.id)} 
                                className="btn btn-primary" 
                                style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                Publish Now
                              </button>
                              <button 
                                onClick={() => {
                                  setSchedulingItemId(item.id);
                                  setScheduledTimeInput('');
                                }} 
                                className="btn btn-secondary" 
                                style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                Schedule
                              </button>
                              <button 
                                onClick={() => handleDeleteContent(item.id)} 
                                className="btn btn-secondary" 
                                style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#ef4444', backgroundColor: 'transparent' }}
                              >
                                Delete
                              </button>
                            </>
                          )}

                          {item.status === 'SCHEDULED' && (
                            <>
                              <button 
                                onClick={() => handlePublishImmediate(item.id)} 
                                className="btn btn-primary" 
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                              >
                                Publish Now
                              </button>
                              <button 
                                onClick={() => handleRevertToDraft(item.id)} 
                                className="btn btn-secondary" 
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                              >
                                Revert to Draft
                              </button>
                              <button 
                                onClick={() => handleDeleteContent(item.id)} 
                                className="btn btn-secondary" 
                                style={{ padding: '6px 12px', fontSize: '12px', color: '#ef4444', backgroundColor: 'transparent' }}
                              >
                                Cancel Post
                              </button>
                            </>
                          )}

                          {item.status === 'PUBLISHED' && (
                            <button 
                              onClick={() => handleDeleteContent(item.id)} 
                              className="btn btn-secondary" 
                              style={{ padding: '6px 12px', fontSize: '12px', color: '#ef4444', backgroundColor: 'transparent' }}
                            >
                              Delete from Log
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="list-item">
                        <div className="item-info">
                          <span className="platform-badge linkedin">LinkedIn</span>
                          <div>
                            <span className="item-title">Standard RAG vs Agentic Loops in Enterprise</span>
                            <div className="item-meta">Scheduled &bull; July 8 at 9:00 AM</div>
                          </div>
                        </div>
                        <span className="item-status scheduled">SCHEDULED</span>
                      </div>
                      <div className="list-item">
                        <div className="item-info">
                          <span className="platform-badge twitter">Twitter</span>
                          <div>
                            <span className="item-title">5 Developer tools to automate your coding in 2026</span>
                            <div className="item-meta">Draft &bull; Needs review</div>
                          </div>
                        </div>
                        <span className="item-status draft">DRAFT</span>
                      </div>
                      <div className="list-item">
                        <div className="item-info">
                          <span className="platform-badge linkedin">LinkedIn</span>
                          <div>
                            <span className="item-title">Meeting with Startup founder lessons: bootstrap or seed?</span>
                            <div className="item-meta">Published &bull; July 5 at 3:12 PM</div>
                          </div>
                        </div>
                        <span className="item-status published">PUBLISHED</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Right Side: Smart AI Notifications */}
              <div className="card">
                <div className="flex-align-center margin-b-16">
                  <Sparkles size={18} className="text-muted" style={{ color: 'var(--accent-purple)' }} />
                  <h3>Agentic Reminders</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.05)', borderLeft: '3px solid var(--accent-purple)', padding: '12px', borderRadius: '4px' }}>
                    <span className="font-12" style={{ fontWeight: 600, color: 'var(--accent-purple)', display: 'block', marginBottom: '4px' }}>CALENDAR INTELLIGENCE</span>
                    <span className="font-14" style={{ display: 'block', marginBottom: '8px' }}>
                      You have a <strong>Founder Sync Meeting</strong> scheduled on July 9. 
                    </span>
                    <button 
                      onClick={() => {
                        setActiveTab('generator');
                        setGenTopic('Lessons from a sync meeting with a tech startup founder about SaaS metrics.');
                        setGenPlatform('linkedin');
                      }}
                      className="btn btn-secondary" 
                      style={{ padding: '6px 12px', fontSize: '11px' }}
                    >
                      Draft LinkedIn Post
                    </button>
                  </div>

                  <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', borderLeft: '3px solid var(--accent-blue)', padding: '12px', borderRadius: '4px' }}>
                    <span className="font-12" style={{ fontWeight: 600, color: 'var(--accent-blue)', display: 'block', marginBottom: '4px' }}>ENGAGEMENT ALERTS</span>
                    <span className="font-14" style={{ color: 'var(--text-secondary)' }}>
                      Your post on <strong>RAG Architecture</strong> generated 34% more impressions than average. We suggest making a Twitter/X thread next!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Profile & AI Analysis */}
        {token && activeTab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            {/* Column 1: Account Settings & Branding Metadata */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Account Settings Card */}
              <div className="card">
                <h3 className="margin-b-24">User Account Profile</h3>
                <form onSubmit={handleSaveAccountSettings}>
                  {/* Profile Picture Preview Area */}
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px', padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                    <div style={{ position: 'relative' }}>
                      {userProfileImage ? (
                        <img 
                          src={userProfileImage} 
                          alt="Profile Preview" 
                          style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-purple)', boxShadow: '0 0 15px rgba(168, 85, 247, 0.2)' }} 
                        />
                      ) : (
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                          {userFirstName.substring(0, 1).toUpperCase()}{userLastName.substring(0, 1).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{userFirstName} {userLastName}</h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>Profile Photo Preview</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>First Name</label>
                      <input type="text" value={userFirstName} onChange={(e) => setUserFirstName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input type="text" value={userLastName} onChange={(e) => setUserLastName(e.target.value)} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Profile Image</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px', alignItems: 'center' }}>
                      <div>
                        <span className="font-12 text-muted" style={{ display: 'block', marginBottom: '6px' }}>Upload Local File</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setUserProfileImage(reader.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          style={{ fontSize: '12px', padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', width: '100%', cursor: 'pointer' }}
                        />
                      </div>
                      <div>
                        <span className="font-12 text-muted" style={{ display: 'block', marginBottom: '6px' }}>Or Paste Image URL</span>
                        <input 
                          type="text" 
                          value={userProfileImage.startsWith('data:') ? 'Local file uploaded' : userProfileImage} 
                          onChange={(e) => setUserProfileImage(e.target.value)} 
                          placeholder="e.g. https://images.unsplash.com/..." 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Account Email</label>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <input type="email" value={userEmail} readOnly style={{ opacity: 0.7, cursor: 'not-allowed' }} />
                      {emailVerified ? (
                        <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-teal)', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={14} /> Verified
                        </span>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}>
                            Unverified
                          </span>
                          <button 
                            type="button" 
                            onClick={handleVerifyEmail} 
                            disabled={verificationStatus === 'verifying'} 
                            className="btn btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            {verificationStatus === 'verifying' && <div className="loading-spinner" />}
                            Verify
                          </button>
                        </div>
                      )}
                    </div>
                    {verificationStatus === 'success' && <p className="font-12" style={{ color: 'var(--accent-teal)', marginTop: '4px' }}>Email verified successfully!</p>}
                    {verificationStatus === 'error' && <p className="font-12" style={{ color: '#f43f5e', marginTop: '4px' }}>Verification failed.</p>}
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '12px' }}>
                    <button type="submit" className="btn btn-primary" disabled={accountStatus === 'saving'}>
                      {accountStatus === 'saving' && <div className="loading-spinner" />}
                      Save Account Settings
                    </button>
                    {accountStatus === 'success' && <span className="font-14" style={{ color: 'var(--accent-teal)' }}>Account settings updated!</span>}
                    {accountStatus === 'error' && <span className="font-14" style={{ color: '#f43f5e' }}>Failed to update account.</span>}
                  </div>
                </form>
              </div>

              {/* Profile Branding Card */}
              <div className="card">
                <h3 className="margin-b-24">Profile Branding Metadata</h3>
                <form onSubmit={handleSaveProfile}>
                  <div className="form-group">
                    <label>Professional Bio</label>
                    <textarea value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} required />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label>Industry</label>
                      <input type="text" value={profileForm.industry} onChange={(e) => setProfileForm({ ...profileForm, industry: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label>Target Niche</label>
                      <input type="text" value={profileForm.niche} onChange={(e) => setProfileForm({ ...profileForm, niche: e.target.value })} required />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label>Location</label>
                      <input type="text" value={profileForm.location} onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Website</label>
                      <input type="text" value={profileForm.website} onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Experience (Years)</label>
                      <input type="number" value={profileForm.experienceYears} onChange={(e) => setProfileForm({ ...profileForm, experienceYears: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Personal Brand Statement</label>
                    <textarea value={profileForm.personalBrandStatement} onChange={(e) => setProfileForm({ ...profileForm, personalBrandStatement: e.target.value })} />
                  </div>

                  <div className="form-group">
                    <label>Target Audience</label>
                    <input type="text" value={profileForm.targetAudience} onChange={(e) => setProfileForm({ ...profileForm, targetAudience: e.target.value })} />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '12px' }}>
                    <button type="submit" className="btn btn-primary" disabled={profileStatus === 'saving'}>
                      {profileStatus === 'saving' && <div className="loading-spinner" />}
                      Save Branding Details
                    </button>
                    {profileStatus === 'success' && <span className="font-14" style={{ color: 'var(--accent-teal)' }}>Details saved successfully!</span>}
                  </div>
                </form>
              </div>

              {/* Connected Social Accounts Card */}
              <div className="card" style={{ marginTop: '24px' }}>
                <h3 className="margin-b-16">Connected Social Accounts</h3>
                <p className="font-12 text-muted margin-b-24">
                  Connect your profiles to publish posts directly and view live analytics.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* LinkedIn */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="platform-badge linkedin" style={{ margin: 0, padding: '6px 12px', minWidth: '80px', textAlign: 'center' }}>LinkedIn</div>
                      {connectedAccounts.some(acc => acc.platform === 'LINKEDIN') ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {connectedAccounts.find(acc => acc.platform === 'LINKEDIN').profileImageUrl && (
                            <img src={connectedAccounts.find(acc => acc.platform === 'LINKEDIN').profileImageUrl} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                          )}
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {connectedAccounts.find(acc => acc.platform === 'LINKEDIN').username}
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--accent-teal)' }}>Connected</span>
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Not connected</span>
                      )}
                    </div>
                    {connectedAccounts.some(acc => acc.platform === 'LINKEDIN') ? (
                      <button 
                        onClick={() => handleDisconnectSocial('linkedin')} 
                        className="btn btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleConnectSocial('linkedin')} 
                        className="btn btn-primary" 
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Connect
                      </button>
                    )}
                  </div>

                  {/* Twitter */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="platform-badge twitter" style={{ margin: 0, padding: '6px 12px', minWidth: '80px', textAlign: 'center' }}>Twitter/X</div>
                      {connectedAccounts.some(acc => acc.platform === 'TWITTER') ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {connectedAccounts.find(acc => acc.platform === 'TWITTER').profileImageUrl && (
                            <img src={connectedAccounts.find(acc => acc.platform === 'TWITTER').profileImageUrl} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                          )}
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {connectedAccounts.find(acc => acc.platform === 'TWITTER').username}
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--accent-teal)' }}>Connected</span>
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Not connected</span>
                      )}
                    </div>
                    {connectedAccounts.some(acc => acc.platform === 'TWITTER') ? (
                      <button 
                        onClick={() => handleDisconnectSocial('twitter')} 
                        className="btn btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleConnectSocial('twitter')} 
                        className="btn btn-primary" 
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Analysis */}
            <div className="card">
              <div className="flex-between margin-b-24">
                <h3>AI Profile Analysis</h3>
                <button 
                  onClick={handleRunAnalysis} 
                  disabled={analyzingProfile} 
                  className="btn btn-secondary" 
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                  {analyzingProfile ? <div className="loading-spinner" /> : <RefreshCw size={14} />}
                  Analyze Profile
                </button>
              </div>

              {aiAnalysis ? (
                <div style={{ display: 'flex', flexType: 'column', flexDirection: 'column', gap: '16px' }}>
                  <div className="analysis-score-container">
                    <div className="circular-progress-glow" style={{ '--pct': '300deg' }}>
                      <span className="progress-value">84%</span>
                    </div>
                    <div>
                      <h4 style={{ marginBottom: '4px' }}>Brand Score Profile</h4>
                      <p className="font-12 text-muted">Analysis of niche depth, target audience alignment, and consistency indexes.</p>
                    </div>
                  </div>

                  <h4 className="margin-b-16">Branding Recommendations</h4>
                  {Array.isArray(aiAnalysis) ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {aiAnalysis.map((rec, index) => (
                        <div key={index} style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px' }}>
                          <div className="flex-between" style={{ marginBottom: '6px' }}>
                            <span style={{ fontWeight: 600, fontSize: '14px' }}>{rec.title}</span>
                            <span className={`item-status ${rec.priority === 'HIGH' ? 'draft' : 'scheduled'}`}>{rec.priority}</span>
                          </div>
                          <p className="font-12 text-secondary">{rec.reason}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="ai-output-text" style={{ minHeight: 'auto', whiteSpace: 'pre-wrap' }}>
                      {typeof aiAnalysis === 'string' ? aiAnalysis : JSON.stringify(aiAnalysis, null, 2)}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div className="card-icon purple" style={{ width: '48px', height: '48px', borderRadius: '50%' }}>
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '4px' }}>No Profile Analysis Available</h4>
                    <p className="font-12 text-muted" style={{ maxWidth: '280px', margin: '0 auto' }}>
                      Click the "Analyze Profile" button above to run the Profile Analysis Agent workflow and generate recommendations.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: AI Content Generator */}
        {token && activeTab === 'generator' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
            {/* Input Config Card */}
            <div className="card">
              <h3 className="margin-b-24">Generation Options</h3>
              <form onSubmit={handleGenerateContent}>
                <div className="form-group">
                  <label>Target Platform</label>
                  <select value={genPlatform} onChange={(e) => setGenPlatform(e.target.value)}>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter / X</option>
                    <option value="instagram">Instagram Caption</option>
                    <option value="youtube">YouTube Description</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Tone of Voice</label>
                    <select value={genTone} onChange={(e) => setGenTone(e.target.value)}>
                      <option value="professional">Professional</option>
                      <option value="conversational">Conversational</option>
                      <option value="inspirational">Inspirational</option>
                      <option value="educational">Educational</option>
                      <option value="direct">Direct</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Content Template</label>
                    <select value={genContentType} onChange={(e) => setGenContentType(e.target.value)}>
                      <option value="educational">Educational / Core Topic</option>
                      <option value="personal_story">Personal Story</option>
                      <option value="industry_update">Industry Update</option>
                      <option value="promotion">Promo / Launch</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Content Topic</label>
                  <textarea 
                    value={genTopic} 
                    onChange={(e) => setGenTopic(e.target.value)} 
                    placeholder="Enter what you want the post to be about..." 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Additional Instructions (Optional)</label>
                  <input 
                    type="text" 
                    value={genInstructions} 
                    onChange={(e) => setGenInstructions(e.target.value)}
                    placeholder="e.g. Include bullet points, keep it short..."
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={generatingContent}>
                  {generatingContent ? (
                    <>
                      <div className="loading-spinner" />
                      Generating Content...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generate Content Draft
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Generated Output Card */}
            <div className="card ai-output-card">
              <div className="flex-between margin-b-24">
                <h3>Draft Output</h3>
                {generatedOutput && (
                  <button 
                    onClick={handleSaveDraft} 
                    disabled={contentStatus === 'saving'}
                    className="btn btn-secondary" 
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    {contentStatus === 'saving' ? <div className="loading-spinner" /> : <Send size={14} />}
                    Save to Queue
                  </button>
                )}
              </div>

              {generatedOutput ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="ai-output-text" style={{ whiteSpace: 'pre-wrap' }}>
                    {typeof generatedOutput === 'string' ? generatedOutput : JSON.stringify(generatedOutput, null, 2)}
                  </div>
                  {contentStatus === 'success' && (
                    <span className="font-14" style={{ color: 'var(--accent-teal)', textAlign: 'right' }}>
                      Draft saved to content list successfully!
                    </span>
                  )}
                  {contentStatus === 'error' && (
                    <span className="font-14" style={{ color: '#f43f5e', textAlign: 'right' }}>
                      Failed to save draft to database.
                    </span>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div className="card-icon teal" style={{ width: '48px', height: '48px', borderRadius: '50%' }}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '4px' }}>No Draft Generated Yet</h4>
                    <p className="font-12 text-muted" style={{ maxWidth: '300px', margin: '0 auto' }}>
                      Fill in the generation options on the left and click "Generate" to generate a tailored multi-platform post draft.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Calendar & Events */}
        {token && activeTab === 'calendar' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '24px' }}>
            {/* Calendar Grid View */}
            <div className="card">
              <div className="flex-between margin-b-24">
                <h3>Event Calendar - July 2026</h3>
                <span className="font-14 text-muted">Weekly Sync Enabled</span>
              </div>

              <div className="calendar-grid">
                {/* Header Days */}
                <div className="calendar-header-day">Mon</div>
                <div className="calendar-header-day">Tue</div>
                <div className="calendar-header-day">Wed</div>
                <div className="calendar-header-day">Thu</div>
                <div className="calendar-header-day">Fri</div>
                <div className="calendar-header-day">Sat</div>
                <div className="calendar-header-day">Sun</div>

                {/* Day Cells (Mocks for July 6th - July 12th) */}
                {[
                  { date: 6, active: true, events: [] },
                  { date: 7, active: true, today: true, events: [] },
                  { date: 8, active: true, events: [Array.isArray(calendarEvents) ? calendarEvents.find(e => e.id === 1) : null].filter(Boolean) },
                  { date: 9, active: true, events: [Array.isArray(calendarEvents) ? calendarEvents.find(e => e.id === 2) : null].filter(Boolean) },
                  { date: 10, active: true, events: [Array.isArray(calendarEvents) ? calendarEvents.find(e => e.id === 3) : null].filter(Boolean) },
                  { date: 11, active: true, events: [] },
                  { date: 12, active: true, events: [Array.isArray(calendarEvents) ? calendarEvents.find(e => e.id === 4) : null].filter(Boolean) }
                ].map((cell, idx) => (
                  <div key={idx} className={`calendar-day-cell ${cell.active ? 'active-month' : ''} ${cell.today ? 'today' : ''}`}>
                    <span className="calendar-day-number">{cell.date}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {cell.events.map(ev => (
                        <div 
                          key={ev.id} 
                          className={`calendar-event-item ${ev.eventType?.toLowerCase() || 'content_posting'}`}
                          title={`${ev.title}\nClick to draft a post inspired by this event.`}
                          onClick={() => handleEventClick(ev)}
                          style={{ cursor: 'pointer' }}
                        >
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="font-12 text-muted" style={{ marginTop: '16px' }}>
                💡 <strong>Agentic Tip:</strong> Click on any scheduled calendar event box (like the sync meeting or webinar) to automatically generate ideas and draft social content inspired by it.
              </p>
            </div>

            {/* Add Event Form */}
            <div className="card">
              <h3 className="margin-b-24">Add Event / Activity</h3>
              <form onSubmit={handleAddEvent}>
                <div className="form-group">
                  <label>Event Title</label>
                  <input 
                    type="text" 
                    value={newEvent.title} 
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} 
                    placeholder="e.g. Sync meeting with founder" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Description / Context</label>
                  <textarea 
                    value={newEvent.description} 
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} 
                    placeholder="Provide details about the meeting or event..." 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>Start Date & Time</label>
                    <input 
                      type="datetime-local" 
                      value={newEvent.startTime} 
                      onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date & Time</label>
                    <input 
                      type="datetime-local" 
                      value={newEvent.endTime} 
                      onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label>Event Type</label>
                    <select value={newEvent.eventType} onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}>
                      <option value="CONTENT_POSTING">Content Posting</option>
                      <option value="MEETING">Meeting</option>
                      <option value="ANALYTICS_REVIEW">Analytics Review</option>
                      <option value="MEETING">Webinar/Event</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Target Platform</label>
                    <select value={newEvent.platform} onChange={(e) => setNewEvent({ ...newEvent, platform: e.target.value })}>
                      <option value="LINKEDIN">LinkedIn</option>
                      <option value="TWITTER">Twitter/X</option>
                      <option value="INSTAGRAM">Instagram</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '12px' }}>
                  <button type="submit" className="btn btn-primary" disabled={eventStatus === 'saving'}>
                    {eventStatus === 'saving' && <div className="loading-spinner" />}
                    Add Event
                  </button>
                  {eventStatus === 'success' && <span className="font-14" style={{ color: 'var(--accent-teal)' }}>Event added!</span>}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 5: Analytics */}
        {token && activeTab === 'analytics' && (
          <div>
            <div className="stats-grid">
              <div className="card">
                <div className="card-header">
                  <span>LinkedIn Followers</span>
                  <span className="platform-badge linkedin">LinkedIn</span>
                </div>
                <div className="card-value">1,850</div>
                <p className="font-12 text-muted">Impression Count: 12,400 &bull; Engagement: 810</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <span>Twitter Followers</span>
                  <span className="platform-badge twitter">Twitter</span>
                </div>
                <div className="card-value">600</div>
                <p className="font-12 text-muted">Impression Count: 5,600 &bull; Engagement: 210</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <span>Total Impressions</span>
                  <div className="card-icon blue"><Eye size={16} /></div>
                </div>
                <div className="card-value">18,000</div>
                <p className="font-12 text-muted">Across all channels</p>
              </div>
            </div>

            <div className="card">
              <h3 className="margin-b-24">Platform Comparison Metrics</h3>
              <div className="list-container">
                {analyticsList.map((anal, index) => (
                  <div className="list-item" key={index}>
                    <div className="item-info">
                      <span className={`platform-badge ${anal.platform}`}>
                        {anal.platform}
                      </span>
                      <div>
                        <span className="item-title" style={{ fontWeight: 600 }}>{anal.followers.toLocaleString()} Followers</span>
                        <div className="item-meta">
                          Impressions: {anal.impressions.toLocaleString()} &bull; Clicks: {anal.clicks} &bull; Engagement Rate: {anal.engagementRate}%
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="font-14" style={{ fontWeight: 600, color: 'var(--accent-purple)', display: 'block' }}>
                        Score: {anal.brandScore}/100
                      </span>
                      <span className="font-12 text-muted">Authority Tier</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Server Settings */}
        {token && activeTab === 'settings' && (
          <div style={{ maxWidth: '540px' }} className="card">
            <h3 className="margin-b-24">Local API Configuration</h3>
            
            <div className="form-group">
              <label>Backend API Port</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input 
                  type="text" 
                  value={backendPort} 
                  onChange={(e) => setBackendPort(e.target.value)} 
                  placeholder="e.g. 8080"
                />
                <button 
                  onClick={() => {
                    localStorage.setItem('backend_port', backendPort);
                    checkConnection();
                  }}
                  className="btn btn-primary"
                  style={{ flexShrink: 0 }}
                >
                  Save & Reconnect
                </button>
              </div>
              <p className="font-12 text-muted" style={{ marginTop: '4px' }}>
                Specify the port your Spring Boot backend is running on (typically 8080 or 8085).
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '24px', paddingTop: '24px' }}>
              <h4 className="margin-b-16">Connection Status Details</h4>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Status</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600, color: backendStatus === 'online' ? 'var(--accent-teal)' : '#f43f5e' }}>
                      {backendStatus === 'online' ? 'CONNECTED' : 'DISCONNECTED (MOCK / DEMO MODE)'}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Endpoint URL</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--mono-font)' }}>{baseUrl}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Auth Token</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'var(--mono-font)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                      {token ? `${token.substring(0, 16)}...` : 'None'}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Current User ID</td>
                    <td style={{ padding: '8px 0', textAlign: 'right' }}>{userId}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
