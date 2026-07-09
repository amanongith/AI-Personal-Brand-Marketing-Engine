import React from 'react';
import { CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';

export default function ProfileTab({
  userFirstName,
  setUserFirstName,
  userLastName,
  setUserLastName,
  userProfileImage,
  setUserProfileImage,
  userEmail,
  emailVerified,
  verificationStatus,
  accountStatus,
  handleSaveAccountSettings,
  handleVerifyEmail,
  profileForm,
  setProfileForm,
  profileStatus,
  handleSaveProfile,
  connectedAccounts,
  handleDisconnectSocial,
  handleConnectSocial,
  handleRunAnalysis,
  analyzingProfile,
  aiAnalysis
}) {
  return (
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
                    value={userProfileImage && userProfileImage.startsWith('data:') ? 'Local file uploaded' : userProfileImage || ''} 
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

            {/* Google Calendar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="platform-badge calendar" style={{ margin: 0, padding: '6px 12px', minWidth: '80px', textAlign: 'center', backgroundColor: '#4285f4', color: 'white' }}>Google Cal</div>
                {connectedAccounts.some(acc => acc.platform === 'GOOGLE') ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {connectedAccounts.find(acc => acc.platform === 'GOOGLE').profileImageUrl && (
                      <img src={connectedAccounts.find(acc => acc.platform === 'GOOGLE').profileImageUrl} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    )}
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {connectedAccounts.find(acc => acc.platform === 'GOOGLE').username}
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--accent-teal)' }}>Connected</span>
                    </div>
                  </div>
                ) : (
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Not connected</span>
                )}
              </div>
              {connectedAccounts.some(acc => acc.platform === 'GOOGLE') ? (
                <button 
                  onClick={() => handleDisconnectSocial('google')} 
                  className="btn btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                >
                  Disconnect
                </button>
              ) : (
                <button 
                  onClick={() => handleConnectSocial('google')} 
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

      {/* Profile Analysis Column */}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
  );
}
