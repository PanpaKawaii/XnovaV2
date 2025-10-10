// TeamManagement.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users, Edit3, Check, X, Shield, Settings, Image, Crown, UserMinus, UserPlus, Search, Mail, LogOut, Trash2, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../hooks/ThemeContext';
import SubUserHeader from '../../layouts/UserLayout/SubUserHeader/SubUserHeader';
import './TeamManagement.css';
import { useTranslation } from 'react-i18next';

const initialTeam = {
  id: '1',
  name: 'Dream Team',
  logo: '',
  description: 'A team of passionate footballers.',
  members: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      profileImage: '',
      position: 'Forward',
      role: 'captain',
      isOnline: true,
      joinedDate: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      profileImage: '',
      position: 'Midfielder',
      role: 'member',
      isOnline: false,
      joinedDate: new Date().toISOString(),
    },
  ],
  acceptNewMembers: true,
  createdDate: new Date().toISOString(),
};

const TeamManagement = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const passedUser = location.state?.user || {};
  const passedUserInfo = location.state?.userInfo || {};

  const [activeTab, setActiveTab] = useState('team');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'profile') {
      navigate('/profile', { 
        state: { 
          user: passedUser, 
          userInfo: passedUserInfo 
        } 
      });
    }
  };

  const updatedInitialTeam = {
    ...initialTeam,
    members: initialTeam.members.map(member => 
      member.id === '1' 
        ? {
            ...member,
            name: passedUserInfo.name || member.name,
            email: passedUser.email || member.email,
            profileImage: passedUserInfo.image || member.profileImage,
          }
        : member
    ),
  };

  const [team, setTeam] = useState(updatedInitialTeam);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editedTeam, setEditedTeam] = useState(team);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const currentUserId = '1';
  const isUserCaptain = team.members.find(m => m.id === currentUserId)?.role === 'captain';

  const handleSaveTeam = () => {
    setTeam(editedTeam);
    setIsEditingTeam(false);
  };
  const handleCancelTeam = () => {
    setEditedTeam(team);
    setIsEditingTeam(false);
  };

  const handleRemoveMember = (memberId) => {
    setTeam(prev => ({
      ...prev,
      members: prev.members.filter(member => member.id !== memberId)
    }));
  };
  const handlePromoteMember = (memberId) => {
    setTeam(prev => ({
      ...prev,
      members: prev.members.map(member => 
        member.id === memberId 
          ? { ...member, role: 'captain' }
          : member.role === 'captain' 
            ? { ...member, role: 'member' }
            : member
      )
    }));
  };
  const handleAddMember = (email) => {
    alert(`Invitation sent to ${email}!`);
    setShowAddModal(false);
    setNewMemberEmail('');
  };

  const handleToggleAcceptMembers = () => {
    setTeam(prev => ({ ...prev, acceptNewMembers: !prev.acceptNewMembers }));
  };
  const handleLeaveTeam = () => {
    alert('You have left the team!');
    setShowLeaveModal(false);
  };
  const handleDeleteTeam = () => {
    if (confirmText === 'DELETE') {
      alert('Team has been deleted!');
      setShowDeleteModal(false);
      setConfirmText('');
    }
  };

  const filteredMembers = team.members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const MemberCard = ({ member }) => (
    <div className="member-card group">
      <div className="member-header">
        <div className="avatar-container">
          <div className="avatar-border">
            <div className="avatar-inner">
              {member.profileImage ? (
                <img src={member.profileImage} alt={member.name} className="avatar-image" />
              ) : (
                <Users className="avatar-icon" />
              )}
            </div>
          </div>
          <div className={`online-status ${member.isOnline ? 'online' : 'offline'}`}></div>
          {member.role === 'captain' && (
            <div className="captain-crown">
              <Crown className="crown-icon" />
            </div>
          )}
        </div>
        <div className="member-info">
          <h4 className="member-name">{member.name}</h4>
          <p className="member-position">{member.position}</p>
        </div>
      </div>
      <div className="member-footer">
        <div className="joined-date">
          <span>Joined {new Date(member.joinedDate).toLocaleDateString()}</span>
        </div>
        {isUserCaptain && member.id !== currentUserId && (
          <div className="action-buttons">
            {member.role !== 'captain' && (
              <button
                onClick={() => handlePromoteMember(member.id)}
                className="promote-button"
                title="Promote to Captain"
              >
                <Crown className="promote-icon" />
              </button>
            )}
            <button
              onClick={() => handleRemoveMember(member.id)}
              className="remove-button"
              title="Remove Member"
            >
              <UserMinus className="remove-icon" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`team-management ${theme} custom-container`}>
      <SubUserHeader 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      <div className="team-overview">
        <div className="overview-container">
          <div className="logo-group group">
            <div className="logo-border">
              <div className="logo-inner">
                {team.logo ? (
                  <img src={team.logo} alt={t('Team Logo')} className="logo-image" />
                ) : (
                  <Users className="logo-icon" />
                )}
              </div>
            </div>
            {isUserCaptain && (
              <button className="upload-button group">
                <Image className="upload-icon" />
              </button>
            )}
            {isUserCaptain && (
              <div className="captain-badge">
                <Shield className="shield-icon" />
                <span>{t('Captain')}</span>
              </div>
            )}
          </div>
          <div className="team-info">
            {isEditingTeam ? (
              <div className="editing-form">
                <input
                  type="text"
                  value={editedTeam.name}
                  onChange={(e) => setEditedTeam({ ...editedTeam, name: e.target.value })}
                  className="team-name-input"
                  placeholder={t('Team Name')}
                />
                <textarea
                  value={editedTeam.description}
                  onChange={(e) => setEditedTeam({ ...editedTeam, description: e.target.value })}
                  className="team-desc-input"
                  placeholder={t('Team Description')}
                  rows={3}
                />
                <div className="editing-buttons">
                  <button
                    onClick={handleSaveTeam}
                    className="save-button"
                  >
                    <Check className="icon" />
                    <span>{t('Save Changes')}</span>
                  </button>
                  <button
                    onClick={handleCancelTeam}
                    className="cancel-button"
                  >
                    <X className="icon" />
                    <span>{t('Cancel')}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="team-details">
                <h2 className="team-name">{team.name}</h2>
                <p className="team-description">{team.description}</p>
                <div className="team-stats">
                  <div className="stat-item">
                    <div className="stat-value">{team.members.length}</div>
                    <div className="stat-label">{t('Members')}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{team.members.filter(m => m.isOnline).length}</div>
                    <div className="stat-label">{t('Online')}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">{t('Created')}</div>
                    <div className="stat-value">{new Date(team.createdDate).toLocaleDateString()}</div>
                  </div>
                </div>
                {isUserCaptain && (
                  <button
                    onClick={() => setIsEditingTeam(true)}
                    className="edit-button"
                  >
                    <Edit3 className="icon" />
                    <span>{t('Edit Team Info')}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="team-members">
        <div className="members-header">
          <div className="header-left">
            <div className="header-icon">
              <Users className="users-icon" />
            </div>
            <h3 className="members-title">{t('Team Members')} ({team.members.length})</h3>
          </div>
          {isUserCaptain && (
            <button
              onClick={() => setShowAddModal(true)}
              className="add-button"
            >
              <UserPlus className="add-icon" />
              <span>{t('Add Member')}</span>
            </button>
          )}
        </div>
        <div className="search-bar">
          <Search className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('Search members...')}
            className="search-input"
          />
        </div>
        <div className="members-grid">
          {filteredMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
        {filteredMembers.length === 0 && (
          <div className="no-members">
            <Users className="no-members-icon" />
            <p>{t('No members found matching your search.')}</p>
          </div>
        )}
      </div>
      <div className="team-settings">
        <div className="settings-header">
          <div className="header-icon">
            <Settings className="settings-icon" />
          </div>
          <h3 className="settings-title">{t('Team Settings')}</h3>
        </div>
        <div className="settings-content">
          {isUserCaptain && (
            <div className="toggle-section">
              <div className="toggle-info">
                <h4 className="toggle-label">{t('Accept New Members')}</h4>
                <p className="toggle-desc">{t('Allow new players to request to join your team')}</p>
              </div>
              <button
                onClick={handleToggleAcceptMembers}
                className={`toggle-button ${team.acceptNewMembers ? 'enabled' : ''}`}
              >
                <span className={`toggle-knob ${team.acceptNewMembers ? 'enabled' : ''}`} />
              </button>
            </div>
          )}
          <div className="action-buttons">
            <button
              onClick={() => setShowLeaveModal(true)}
              className="leave-button"
            >
              <LogOut className="icon" />
              <span>{t('Leave Team')}</span>
            </button>
            {isUserCaptain && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="delete-button"
              >
                <Trash2 className="icon" />
                <span>{t('Delete Team')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
      {showLeaveModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{t('Leave Team')}</h3>
              <button onClick={() => setShowLeaveModal(false)} className="close-button"><X className="close-icon" /></button>
            </div>
            <div className="modal-body">
              <div className="warning-box">
                <AlertTriangle className="alert-icon" />
                <p>{t('Are you sure you want to leave "{{teamName}}"? You\'ll need to be invited again to rejoin.', { teamName: team.name })}</p>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={handleLeaveTeam} className="confirm-button">{t('Leave Team')}</button>
              <button onClick={() => setShowLeaveModal(false)} className="cancel-button">{t('Cancel')}</button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{t('Delete Team')}</h3>
              <button onClick={() => setShowDeleteModal(false)} className="close-button"><X className="close-icon" /></button>
            </div>
            <div className="modal-body">
              <div className="warning-box">
                <AlertTriangle className="alert-icon" />
                <p>{t('This action cannot be undone. This will permanently delete "{{teamName}}" and remove all team data.', { teamName: team.name })}</p>
              </div>
              <div className="confirm-group">
                <label className="confirm-label">{t('Please type DELETE to confirm:')}<span className="delete-word">DELETE</span></label>
                <input type="text" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} className="confirm-input" placeholder={t('Type DELETE here')} />
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={handleDeleteTeam} disabled={confirmText !== 'DELETE'} className={`confirm-delete ${confirmText === 'DELETE' ? 'enabled' : ''}`}>{t('Delete Team')}</button>
              <button onClick={() => setShowDeleteModal(false)} className="cancel-button">{t('Cancel')}</button>
            </div>
          </div>
        </div>
      )}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{t('Add Member')}</h3>
              <button onClick={() => setShowAddModal(false)} className="close-button"><X className="close-icon" /></button>
            </div>
            <div className="modal-body">
              <label className="input-label">{t('Member Email')}</label>
              <input
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="email-input"
                placeholder={t('Enter email to invite')}
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => handleAddMember(newMemberEmail)} className="add-confirm-button">{t('Send Invitation')}</button>
              <button onClick={() => setShowAddModal(false)} className="cancel-button">{t('Cancel')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;