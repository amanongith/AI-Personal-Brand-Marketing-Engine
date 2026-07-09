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

import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import DashboardTab from './components/DashboardTab';
import ProfileTab from './components/ProfileTab';
import GeneratorTab from './components/GeneratorTab';
import CalendarTab from './components/CalendarTab';
import AnalyticsTab from './components/AnalyticsTab';

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
      {token && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          userFirstName={userFirstName} 
          userLastName={userLastName} 
          handleLogout={handleLogout} 
          backendStatus={backendStatus} 
        />
      )}

      {/* Main Content Area */}
      <main className="main-content" style={{ marginLeft: !token ? '0' : '260px' }}>
        
        {/* Connection Header */}
        {token && (
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
        )}

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
        <AuthModal
          token={token}
          authError={authError}
          authSuccess={authSuccess}
          authMode={authMode}
          setAuthMode={setAuthMode}
          authEmail={authEmail}
          setAuthEmail={setAuthEmail}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          authFirstName={authFirstName}
          setAuthFirstName={setAuthFirstName}
          authLastName={authLastName}
          setAuthLastName={setAuthLastName}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
          handleEnterDemo={handleEnterDemo}
        />

        {/* Tab 1: Dashboard */}
        {token && activeTab === 'dashboard' && (
          <DashboardTab
            dashboardData={dashboardData}
            contentsList={contentsList}
            setActiveTab={setActiveTab}
            setGenTopic={setGenTopic}
            setGenPlatform={setGenPlatform}
            schedulingItemId={schedulingItemId}
            setSchedulingItemId={setSchedulingItemId}
            scheduledTimeInput={scheduledTimeInput}
            setScheduledTimeInput={setScheduledTimeInput}
            handlePublishImmediate={handlePublishImmediate}
            handleSchedulePost={handleSchedulePost}
            handleDeleteContent={handleDeleteContent}
            handleRevertToDraft={handleRevertToDraft}
          />
        )}

        {/* Tab 2: Profile & AI Analysis */}
        {token && activeTab === 'profile' && (
          <ProfileTab
            userFirstName={userFirstName}
            setUserFirstName={setUserFirstName}
            userLastName={userLastName}
            setUserLastName={setUserLastName}
            userProfileImage={userProfileImage}
            setUserProfileImage={setUserProfileImage}
            userEmail={userEmail}
            emailVerified={emailVerified}
            verificationStatus={verificationStatus}
            accountStatus={accountStatus}
            handleSaveAccountSettings={handleSaveAccountSettings}
            handleVerifyEmail={handleVerifyEmail}
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            profileStatus={profileStatus}
            handleSaveProfile={handleSaveProfile}
            connectedAccounts={connectedAccounts}
            handleDisconnectSocial={handleDisconnectSocial}
            handleConnectSocial={handleConnectSocial}
            handleRunAnalysis={handleRunAnalysis}
            analyzingProfile={analyzingProfile}
            aiAnalysis={aiAnalysis}
          />
        )}

        {/* Tab 3: AI Content Generator */}
        {token && activeTab === 'generator' && (
          <GeneratorTab
            genPlatform={genPlatform}
            setGenPlatform={setGenPlatform}
            genTone={genTone}
            setGenTone={setGenTone}
            genContentType={genContentType}
            setGenContentType={setGenContentType}
            genTopic={genTopic}
            setGenTopic={setGenTopic}
            genInstructions={genInstructions}
            setGenInstructions={setGenInstructions}
            generatingContent={generatingContent}
            handleGenerateContent={handleGenerateContent}
            generatedOutput={generatedOutput}
            handleSaveDraft={handleSaveDraft}
            contentStatus={contentStatus}
          />
        )}

        {/* Tab 4: Calendar & Events */}
        {token && activeTab === 'calendar' && (
          <CalendarTab
            calendarEvents={calendarEvents}
            handleEventClick={handleEventClick}
            newEvent={newEvent}
            setNewEvent={setNewEvent}
            handleAddEvent={handleAddEvent}
            eventStatus={eventStatus}
          />
        )}

        {/* Tab 5 & 6: Analytics & Settings */}
        {token && (activeTab === 'analytics' || activeTab === 'settings') && (
          <AnalyticsTab
            activeTab={activeTab}
            analyticsList={analyticsList}
            backendPort={backendPort}
            setBackendPort={setBackendPort}
            checkConnection={checkConnection}
            backendStatus={backendStatus}
            baseUrl={baseUrl}
            token={token}
            userId={userId}
          />
        )}

      </main>
    </div>
  );
}

export default App;
