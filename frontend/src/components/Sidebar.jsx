import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Calendar, 
  BarChart3, 
  LogOut, 
  Sparkles 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, userFirstName, userLastName, handleLogout, backendStatus }) {
  return (
    <aside className="sidebar">
      <div className="brand-container">
        <div className="brand-icon">
          <Sparkles size={22} />
        </div>
        <span className="brand-name">BrandEngine.AI</span>
      </div>

      <ul className="nav-menu">
        <li>
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>
        </li>
        <li>
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>Profile settings</span>
          </button>
        </li>
        <li>
          <button 
            className={`nav-item ${activeTab === 'generator' ? 'active' : ''}`}
            onClick={() => setActiveTab('generator')}
          >
            <FileText size={18} />
            <span>AI Content Gen</span>
          </button>
        </li>
        <li>
          <button 
            className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <Calendar size={18} />
            <span>Calendar Sync</span>
          </button>
        </li>
        <li>
          <button 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={18} />
            <span>Brand Analytics</span>
          </button>
        </li>
      </ul>

      <div className="sidebar-footer">
        <div className="user-profile-summary">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{userFirstName} {userLastName}</span>
            <span style={{ fontSize: '11px', color: backendStatus === 'online' ? 'var(--accent-teal)' : '#f43f5e', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: backendStatus === 'online' ? 'var(--accent-teal)' : '#f43f5e', display: 'inline-block' }} />
              {backendStatus === 'online' ? 'Server Connected' : 'Server Offline'}
            </span>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
