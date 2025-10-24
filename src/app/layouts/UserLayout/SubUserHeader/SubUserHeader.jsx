import React from 'react';
import { User2, Users } from 'lucide-react';
import { useTheme } from '../../../hooks/ThemeContext';
import './SubUserHeader.css';

const SubUserHeader = ({ activeTab, onTabChange }) => {
  const { theme } = useTheme();

  return (
    <div className={`profile-header ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="header-left">
        <div className="pulse-bar"></div>
        <h1 className="title">
          {activeTab === 'profile' ? 'My Profile' : (activeTab === 'team' ? 'My Team' : (activeTab === 'reward' ? 'Reward' : 'null'))}
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
          <button
            onClick={() => onTabChange('reward')}
            className={`tab-button ${activeTab === 'reward' ? 'active' : ''}`}
          >
            <Users className="icon-small" />
            <span className="tab-label">Reward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubUserHeader;