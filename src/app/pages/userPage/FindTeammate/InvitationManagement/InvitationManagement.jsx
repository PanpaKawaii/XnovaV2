import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Edit2, 
  Check, 
  X, 
  Eye,
  UserCheck,
  UserX,
  Trophy,
  AlertCircle,
  Plus,
  Search
} from 'lucide-react';
import { useTheme } from '../../../../hooks/ThemeContext.jsx';
import { useAuth } from '../../../../hooks/AuthContext/AuthContext.jsx';
import { fetchData, putData, postData } from '../../../../../mocks/CallingAPI.js';
import { Button } from '../../../../components/ui/Button.jsx';
import { Modal } from '../../../../components/ui/Modal.jsx';
import { AlertPopup } from '../../../../components/ui/AlertPopup.jsx';
import './InvitationManagement.css';

const InvitationManagement = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-invitations'); // 'my-invitations' or 'joined-invitations'
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data states
  const [myInvitations, setMyInvitations] = useState([]); // Invitations created by user
  const [joinedInvitations, setJoinedInvitations] = useState([]); // Invitations user joined
  const [allUserInvitations, setAllUserInvitations] = useState([]); // All UserInvitation records
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [participants, setParticipants] = useState([]);
  
  // Alert popup state
  const [alertPopup, setAlertPopup] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null
  });
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    joiningCost: 0,
    totalPlayer: 0,
    availablePlayer: 0,
    standard: '',
    kindOfSport: '',
    location: '',
    date: '',
    startTime: '',
    endTime: '',
    status: 1
  });

  useEffect(() => {
    const fetchInvitationData = async () => {
      try {
        setLoading(true);
        
        // Fetch all invitations (no token needed for public viewing)
        const allInvitations = await fetchData('invitation');
        console.log('All Invitations:', allInvitations);
        
        // If user is not logged in, just show empty lists for user-specific data
        if (!user || !user.token) {
          setMyInvitations([]);
          setJoinedInvitations([]);
          setAllUserInvitations([]);
          setLoading(false);
          return;
        }
        
        // Filter invitations created by current user
        const userCreatedInvitations = allInvitations?.filter(
          inv => inv.userId === user?.id
        ) || [];
        
        // Fetch all user-invitation mappings (requires auth)
        const allUserInv = await fetchData('userinvitation', user.token);
        console.log('All UserInvitations:', allUserInv);
        setAllUserInvitations(allUserInv || []);
        
        // Filter invitations where user is a participant
        const userJoinedInvIds = allUserInv
          ?.filter(ui => ui.userId === user?.id)
          .map(ui => ui.invitationId) || [];
        
        const userJoinedInvitations = allInvitations?.filter(
          inv => userJoinedInvIds.includes(inv.id) && inv.userId !== user?.id
        ) || [];
        
        setMyInvitations(userCreatedInvitations);
        setJoinedInvitations(userJoinedInvitations);
        
      } catch (error) {
        console.error('Error fetching invitation data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitationData();
  }, [user]);

  // Handle edit invitation
  const handleEditInvitation = (invitation) => {
    if (!user || !user.token) {
      setAlertPopup({
        isOpen: true,
        type: 'warning',
        title: 'Yêu cầu đăng nhập',
        message: 'Vui lòng đăng nhập để chỉnh sửa lời mời!',
        onConfirm: null
      });
      return;
    }
    
    setSelectedInvitation(invitation);
    setEditForm({
      name: invitation.name || '',
      joiningCost: invitation.joiningCost || 0,
      totalPlayer: invitation.totalPlayer || 0,
      availablePlayer: invitation.availablePlayer || 0,
      standard: invitation.standard || '',
      kindOfSport: invitation.kindOfSport || '',
      location: invitation.location || '',
      date: invitation.date || '',
      startTime: invitation.startTime || '',
      endTime: invitation.endTime || '',
      status: invitation.status || 1
    });
    setShowEditModal(true);
  };

  // Handle save edited invitation
  const handleSaveEdit = async () => {
    if (!selectedInvitation || !user?.token) return;
    
    try {
      // Prepare the update data
      const updateData = {
        ...selectedInvitation,
        name: editForm.name,
        joiningCost: parseFloat(editForm.joiningCost),
        totalPlayer: parseInt(editForm.totalPlayer),
        availablePlayer: parseInt(editForm.availablePlayer),
        standard: editForm.standard,
        kindOfSport: editForm.kindOfSport,
        location: editForm.location,
        date: editForm.date,
        startTime: editForm.startTime,
        endTime: editForm.endTime,
        status: parseInt(editForm.status)
      };
      
      await putData(`invitation/${selectedInvitation.id}`, updateData, user.token);
      
      // Update local state
      setMyInvitations(prev => 
        prev.map(inv => 
          inv.id === selectedInvitation.id ? { ...inv, ...updateData } : inv
        )
      );
      
      setShowEditModal(false);
      setAlertPopup({
        isOpen: true,
        type: 'success',
        title: 'Thành công',
        message: 'Cập nhật lời mời thành công!',
        onConfirm: null
      });
      
    } catch (error) {
      console.error('Error updating invitation:', error);
      setAlertPopup({
        isOpen: true,
        type: 'error',
        title: 'Lỗi',
        message: 'Có lỗi xảy ra khi cập nhật lời mời!',
        onConfirm: null
      });
    }
  };

  // Handle view participants
  const handleViewParticipants = (invitation) => {
    if (!user || !user.token) {
      setAlertPopup({
        isOpen: true,
        type: 'warning',
        title: 'Yêu cầu đăng nhập',
        message: 'Vui lòng đăng nhập để xem người tham gia!',
        onConfirm: null
      });
      return;
    }
    
    setSelectedInvitation(invitation);
    
    // Get all participants for this invitation
    const invitationParticipants = allUserInvitations.filter(
      ui => ui.invitationId === invitation.id
    );
    
    setParticipants(invitationParticipants);
    setShowParticipantsModal(true);
  };

  // Handle approve/reject participant
  // userInvitationId: ID của bản ghi UserInvitation (bảng mapping)
  // newStatus: 0 = pending (chờ duyệt), 1 = approved (đã duyệt), 2 = rejected (từ chối)
  const handleUpdateParticipantStatus = async (userInvitationId, newStatus) => {
    if (!user?.token) return;
    
    try {
      // Tìm bản ghi UserInvitation hiện tại
      const userInvitation = allUserInvitations.find(ui => ui.id === userInvitationId);
      if (!userInvitation) {
        console.error('UserInvitation not found:', userInvitationId);
        return;
      }
      
      // Log raw data để debug
      console.log('Raw UserInvitation data:', userInvitation);
      
      // Chuẩn bị request body theo API specification
      // PUT api/userinvitation/{userinvitationId}
      // Đảm bảo joinDate là ISO string format
      let joinDateISO = userInvitation.joinDate;
      if (joinDateISO) {
        // Nếu joinDate là Date object, convert sang ISO string
        if (joinDateISO instanceof Date) {
          joinDateISO = joinDateISO.toISOString();
        } else if (typeof joinDateISO === 'string') {
          // Nếu là string, đảm bảo format ISO
          try {
            joinDateISO = new Date(joinDateISO).toISOString();
          } catch (e) {
            console.warn('Invalid joinDate format, using current date:', e);
            joinDateISO = new Date().toISOString();
          }
        }
      } else {
        joinDateISO = new Date().toISOString();
      }
      
      const updateData = {
        joinDate: joinDateISO,
        status: parseInt(newStatus), // Đảm bảo là số nguyên
        userId: parseInt(userInvitation.userId), // Đảm bảo là số nguyên
        invitationId: parseInt(userInvitation.invitationId) // Đảm bảo là số nguyên
      };
      
      console.log('Sending PUT request:', {
        url: `UserInvitation/${userInvitationId}`,
        body: updateData,
        bodyTypes: {
          joinDate: typeof updateData.joinDate,
          status: typeof updateData.status,
          userId: typeof updateData.userId,
          invitationId: typeof updateData.invitationId
        }
      });
      
      // Gọi API PUT với userinvitationId trong URL
      await putData(`UserInvitation/${userInvitationId}`, updateData, user.token);
      
      // Update local state
      setAllUserInvitations(prev =>
        prev.map(ui => ui.id === userInvitationId ? { ...ui, status: newStatus } : ui)
      );
      
      setParticipants(prev =>
        prev.map(p => p.id === userInvitationId ? { ...p, status: newStatus } : p)
      );
      
      // Update available players based on status change
      // Khi duyệt (0 -> 1): giảm availablePlayer
      // Khi từ chối hoặc hủy duyệt (1 -> 0 hoặc 1 -> 2): tăng availablePlayer
      let availablePlayerChange = 0;
      
      if (newStatus === 1 && userInvitation.status !== 1) {
        // Duyệt người tham gia: giảm slot trống
        availablePlayerChange = -1;
      } else if (userInvitation.status === 1 && newStatus !== 1) {
        // Hủy duyệt hoặc từ chối người đã duyệt: tăng slot trống
        availablePlayerChange = 1;
      }
      
      if (availablePlayerChange !== 0) {
        const updatedInvitation = {
          ...selectedInvitation,
          availablePlayer: Math.max(0, selectedInvitation.availablePlayer + availablePlayerChange)
        };
        await putData(`invitation/${selectedInvitation.id}`, updatedInvitation, user.token);
        setMyInvitations(prev =>
          prev.map(inv => inv.id === selectedInvitation.id ? updatedInvitation : inv)
        );
        setSelectedInvitation(updatedInvitation);
      }
      
      const statusMessage = {
        0: 'Đã chuyển về trạng thái chờ duyệt!',
        1: 'Đã duyệt người tham gia!',
        2: 'Đã từ chối người tham gia!'
      };
      
      setAlertPopup({
        isOpen: true,
        type: 'success',
        title: 'Thành công',
        message: statusMessage[newStatus] || 'Cập nhật trạng thái thành công!',
        onConfirm: null
      });
      
    } catch (error) {
      console.error('Error updating participant status:', error);
      setAlertPopup({
        isOpen: true,
        type: 'error',
        title: 'Lỗi',
        message: 'Có lỗi xảy ra khi cập nhật trạng thái!',
        onConfirm: null
      });
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      0: { label: 'Chờ duyệt', className: 'pending' },
      1: { label: 'Đã duyệt', className: 'approved' },
      2: { label: 'Từ chối', className: 'rejected' }
    };
    return statusMap[status] || { label: 'Không xác định', className: 'unknown' };
  };

  // Get invitation status badge
  const getInvitationStatusBadge = (status) => {
    const statusMap = {
      0: { label: 'Nháp', className: 'draft' },
      1: { label: 'Đang mở', className: 'open' },
      2: { label: 'Đã đầy', className: 'full' },
      3: { label: 'Đã đóng', className: 'closed' }
    };
    return statusMap[status] || { label: 'Không xác định', className: 'unknown' };
  };

  // Filter and sort invitations
  const getFilteredInvitations = () => {
    const invitations = activeTab === 'my-invitations' ? myInvitations : joinedInvitations;
    
    let filtered = invitations.filter(inv => {
      // Filter by status
      if (filter !== 'all' && inv.status != filter) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          inv.name?.toLowerCase().includes(query) ||
          inv.location?.toLowerCase().includes(query) ||
          inv.kindOfSport?.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
    
    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      }
      return 0;
    });
    
    return filtered;
  };

  const filteredInvitations = getFilteredInvitations();

  if (loading) {
    return (
      <div className={`invitation-management ${theme}`}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`invitation-management ${theme}`}>

      {!user && (
        <div className='login-prompt'>
          <AlertCircle className='login-prompt-icon' />
          <p>Vui lòng đăng nhập để xem và quản lý lời mời của bạn.</p>
        </div>
      )}

      {user && (
        <>
          {/* Tabs */}
          <div className='tabs'>
            <button
              className={`tab ${activeTab === 'my-invitations' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-invitations')}
            >
              <Edit2 size={18} />
              Lời mời của tôi ({myInvitations.length})
            </button>
            <button
              className={`tab ${activeTab === 'joined-invitations' ? 'active' : ''}`}
              onClick={() => setActiveTab('joined-invitations')}
            >
              <UserCheck size={18} />
              Đã tham gia ({joinedInvitations.length})
            </button>
          </div>
        </>
      )}

      {user && (
        <>
          {/* Filters */}
          <div className='filters'>
        <div className='search-box'>
          <Search className='search-icon' size={18} />
          <input
            type='text'
            placeholder='Tìm kiếm lời mời...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='search-input'
          />
        </div>
        
        <div className='filter-group'>
          <label className='label'>Trạng thái</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className='select'
          >
            <option value='all'>Tất cả</option>
            <option value={0}>Nháp</option>
            <option value={1}>Đang mở</option>
            <option value={2}>Đã đầy</option>
            <option value={3}>Đã đóng</option>
          </select>
        </div>
        
        <div className='filter-group'>
          <label className='label'>Sắp xếp</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='select'
          >
            <option value='date'>Ngày tạo</option>
            <option value='name'>Tên</option>
          </select>
        </div>
      </div>

      {/* Invitation Cards */}
      <div className='invitation-list-container'>
        {filteredInvitations.length === 0 ? (
          <div className='no-invitations'>
            <AlertCircle className='no-invitations-icon' />
            <p>
              {activeTab === 'my-invitations'
                ? 'Bạn chưa tạo lời mời nào.'
                : 'Bạn chưa tham gia lời mời nào.'}
            </p>
          </div>
        ) : (
          <div className='invitation-list'>
            {filteredInvitations.map((invitation) => {
              const statusBadge = getInvitationStatusBadge(invitation.status);
              const participantCount = allUserInvitations.filter(
                ui => ui.invitationId === invitation.id
              ).length;
              
              return (
                <div key={invitation.id} className='invitation-card'>
                  <div className='card-header'>
                    <h4 className='invitation-title'>{invitation.name}</h4>
                    <span className={`status-badge ${statusBadge.className}`}>
                      {statusBadge.label}
                    </span>
                  </div>
                  
                  <div className='card-content'>
                    <div className='info-row'>
                      <MapPin size={16} />
                      <span>{invitation.location}</span>
                    </div>
                    
                    <div className='info-row'>
                      <Calendar size={16} />
                      <span>{new Date(invitation.date).toLocaleDateString('vi-VN')}</span>
                    </div>
                    
                    <div className='info-row'>
                      <Clock size={16} />
                      <span>
                        {invitation.startTime?.substring(0, 5)} - {invitation.endTime?.substring(0, 5)}
                      </span>
                    </div>
                    
                    <div className='info-row'>
                      <Trophy size={16} />
                      <span>{invitation.kindOfSport} - {invitation.standard}</span>
                    </div>
                    
                    <div className='info-row'>
                      <Users size={16} />
                      <span>
                        {invitation.totalPlayer - invitation.availablePlayer}/{invitation.totalPlayer} người
                      </span>
                    </div>
                    
                    <div className='info-row'>
                      <DollarSign size={16} />
                      <span>{invitation.joiningCost?.toLocaleString()} VND</span>
                    </div>
                  </div>
                  
                  {activeTab === 'my-invitations' && (
                    <div className='card-actions'>
                      <Button
                        variant='outline'
                        onClick={() => handleEditInvitation(invitation)}
                        className='action-btn edit-btn'
                      >
                        <Edit2 size={16} />
                        Chỉnh sửa
                      </Button>
                      <Button
                        variant='primary'
                        onClick={() => handleViewParticipants(invitation)}
                        className='action-btn participants-btn'
                      >
                        <Users size={16} />
                        Người tham gia ({participantCount})
                      </Button>
                    </div>
                  )}
                  
                  {activeTab === 'joined-invitations' && (
                    <div className='card-footer'>
                      {(() => {
                        const userInv = allUserInvitations.find(
                          ui => ui.invitationId === invitation.id && ui.userId === user?.id
                        );
                        const status = getStatusBadge(userInv?.status || 0);
                        return (
                          <div className='participant-status'>
                            <span className='status-label'>Trạng thái tham gia:</span>
                            <span className={`status-badge ${status.className}`}>
                              {status.label}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title='Chỉnh sửa lời mời'
        >
          <div className='edit-form'>
            <div className='form-group'>
              <label>Tên lời mời</label>
              <input
                type='text'
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className='form-input'
              />
            </div>
            
            <div className='form-row'>
              <div className='form-group'>
                <label>Môn thể thao</label>
                <input
                  type='text'
                  value={editForm.kindOfSport}
                  onChange={(e) => setEditForm({ ...editForm, kindOfSport: e.target.value })}
                  className='form-input'
                />
              </div>
              
              <div className='form-group'>
                <label>Trình độ</label>
                <select
                  value={editForm.standard}
                  onChange={(e) => setEditForm({ ...editForm, standard: e.target.value })}
                  className='form-input'
                >
                  <option value='Mới bắt đầu'>Mới bắt đầu</option>
                  <option value='Trung bình'>Trung bình</option>
                  <option value='Nâng cao'>Nâng cao</option>
                  <option value='Chuyên nghiệp'>Chuyên nghiệp</option>
                </select>
              </div>
            </div>
            
            <div className='form-group'>
              <label>Địa điểm</label>
              <input
                type='text'
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className='form-input'
              />
            </div>
            
            <div className='form-row'>
              <div className='form-group'>
                <label>Ngày</label>
                <input
                  type='date'
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  className='form-input'
                />
              </div>
              
              <div className='form-group'>
                <label>Giờ bắt đầu</label>
                <input
                  type='time'
                  value={editForm.startTime?.substring(0, 5)}
                  onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value + ':00' })}
                  className='form-input'
                />
              </div>
              
              <div className='form-group'>
                <label>Giờ kết thúc</label>
                <input
                  type='time'
                  value={editForm.endTime?.substring(0, 5)}
                  onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value + ':00' })}
                  className='form-input'
                />
              </div>
            </div>
            
            <div className='form-row'>
              <div className='form-group'>
                <label>Tổng số người</label>
                <input
                  type='number'
                  value={editForm.totalPlayer}
                  onChange={(e) => setEditForm({ ...editForm, totalPlayer: e.target.value })}
                  className='form-input'
                />
              </div>
              
              <div className='form-group'>
                <label>Số chỗ còn trống</label>
                <input
                  type='number'
                  value={editForm.availablePlayer}
                  onChange={(e) => setEditForm({ ...editForm, availablePlayer: e.target.value })}
                  className='form-input'
                />
              </div>
              
              <div className='form-group'>
                <label>Chi phí tham gia</label>
                <input
                  type='number'
                  value={editForm.joiningCost}
                  onChange={(e) => setEditForm({ ...editForm, joiningCost: e.target.value })}
                  className='form-input'
                />
              </div>
            </div>
            
            <div className='form-group'>
              <label>Trạng thái</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className='form-input'
              >
                <option value={0}>Nháp</option>
                <option value={1}>Đang mở</option>
                <option value={2}>Đã đầy</option>
                <option value={3}>Đã đóng</option>
              </select>
            </div>
            
            <div className='modal-actions'>
              <Button variant='outline' onClick={() => setShowEditModal(false)}>
                Hủy
              </Button>
              <Button variant='primary' onClick={handleSaveEdit}>
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Participants Modal */}
      {showParticipantsModal && (
        <Modal
          isOpen={showParticipantsModal}
          onClose={() => setShowParticipantsModal(false)}
          title={`Người tham gia - ${selectedInvitation?.name}`}
        >
          <div className='participants-list'>
            {participants.length === 0 ? (
              <div className='no-participants'>
                <Users className='no-participants-icon' />
                <p>Chưa có người tham gia nào.</p>
              </div>
            ) : (
              participants.map((participant) => {
                const status = getStatusBadge(participant.status || 0);
                return (
                  <div key={participant.id} className='participant-card'>
                    <div className='participant-info'>
                      <div className='participant-avatar'>
                        <Users size={24} />
                      </div>
                      <div className='participant-details'>
                        <span className='participant-name'>
                          User ID: {participant.userId}
                        </span>
                        <span className='participant-date'>
                          Ngày tham gia: {new Date(participant.joinDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                    
                    <div className='participant-actions'>
                      <span className={`status-badge ${status.className}`}>
                        {status.label}
                      </span>
                      
                      {participant.status === 0 && (
                        <div className='action-buttons'>
                          <Button
                            variant='success'
                            size='sm'
                            onClick={() => handleUpdateParticipantStatus(participant.id, 1)}
                            className='approve-btn'
                          >
                            <Check size={16} />
                            Duyệt
                          </Button>
                          <Button
                            variant='danger'
                            size='sm'
                            onClick={() => handleUpdateParticipantStatus(participant.id, 2)}
                            className='reject-btn'
                          >
                            <X size={16} />
                            Từ chối
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Modal>
      )}

      {/* Alert Popup */}
      <AlertPopup
        isOpen={alertPopup.isOpen}
        onClose={() => setAlertPopup({ ...alertPopup, isOpen: false })}
        type={alertPopup.type}
        title={alertPopup.title}
        message={alertPopup.message}
        onConfirm={alertPopup.onConfirm}
        autoClose={alertPopup.type === 'success'}
        autoCloseDelay={2000}
      />
        </>
      )}
    </div>
  );
};

export default InvitationManagement;
