import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Calendar, 
  BarChart3, 
  LogOut, 
  Sparkles,
  Settings 
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
        <li>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            <span>Server Settings</span>
          </button>
        </li>
      </ul>

      <div className="sidebar-footer">
        <div className="user-badge" style={{ marginBottom: '16px' }}>
          <div className="user-avatar">
            {userFirstName ? userFirstName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-details">
            <span className="user-name">{userFirstName} {userLastName}</span>
            <span className="user-role">Creator Account</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
          <span style={{ fontSize: '11px', color: backendStatus === 'online' ? 'var(--accent-teal)' : '#f43f5e', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: backendStatus === 'online' ? 'var(--accent-teal)' : '#f43f5e', display: 'inline-block' }} />
            {backendStatus === 'online' ? 'Server Connected' : 'Server Offline'}
          </span>
          
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '6px', minWidth: 'auto', marginLeft: 'auto' }} title="Log out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
