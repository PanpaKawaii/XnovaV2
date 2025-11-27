import { TicketCheck, User2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
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
            <TicketCheck className="icon-small" />
            <span className="tab-label">Reward</span>
          </button>
        </div>

        {localStorage.getItem('ActivateMembership') ?
          <Link to='/payment-status/?message=Thanh%20toán%20Membership%20thành%20công'>
            <button className='tab-button active'>ACTIVATE MEMBERSHIP</button>
          </Link>
          :
          <Link to='/membership'>
            <button className='tab-button active'>MEMBERSHIP</button>
          </Link>}
      </div>
    </div>
  );
};

export default SubUserHeader;