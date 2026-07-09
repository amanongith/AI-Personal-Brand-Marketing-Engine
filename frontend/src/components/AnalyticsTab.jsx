import React from 'react';
import { Eye } from 'lucide-react';

export default function AnalyticsTab({
  activeTab,
  analyticsList,
  backendPort,
  setBackendPort,
  checkConnection,
  backendStatus,
  baseUrl,
  token,
  userId
}) {
  if (activeTab === 'analytics') {
    return (
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
    );
  }

  if (activeTab === 'settings') {
    return (
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
    );
  }

  return null;
}
