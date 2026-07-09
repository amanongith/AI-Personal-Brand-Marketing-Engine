import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AuthModal({
  token,
  authError,
  authSuccess,
  authMode,
  setAuthMode,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authFirstName,
  setAuthFirstName,
  authLastName,
  setAuthLastName,
  handleLogin,
  handleRegister,
  handleEnterDemo
}) {
  if (token) return null;

  return (
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
  );
}
