import React from 'react';
import { 
  TrendingUp, 
  ThumbsUp, 
  Share2, 
  Sparkles, 
  Plus 
} from 'lucide-react';

export default function DashboardTab({
  dashboardData,
  contentsList,
  setActiveTab,
  setGenTopic,
  setGenPlatform,
  schedulingItemId,
  setSchedulingItemId,
  scheduledTimeInput,
  setScheduledTimeInput,
  handlePublishImmediate,
  handleSchedulePost,
  handleDeleteContent,
  handleRevertToDraft
}) {
  return (
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
  );
}
