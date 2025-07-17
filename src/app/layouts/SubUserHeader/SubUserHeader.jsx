import React from 'react';
import { User2, Users } from 'lucide-react';
import { useTheme } from '../../hooks/ThemeContext';
import './SubUserHeader.css';

const SubUserHeader = ({ activeTab, onTabChange }) => {
  const { theme } = useTheme();

  return (
    <div className={`profile-header ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="header-left">
        <div className="pulse-bar"></div>
        <h1 className="title">
          XNOVA Profile
        </h1>
      </div>
      
      <div className="header-right">
        {/* Tab Navigation */}
        <div className="tab-nav">
          <button
            onClick={() => onTabChange('profile')}
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <User2 className="icon-small" />
            <span className="tab-label">Profile</span>
          </button>
          <button
            onClick={() => onTabChange('team')}
            className={`tab-button ${activeTab === 'team' ? 'active' : ''}`}
          >
            <Users className="icon-small" />
            <span className="tab-label">Team</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubUserHeader;