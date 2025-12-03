import React, { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { AlertPopup } from '../../../components/ui/AlertPopup';
import { CreateMatchModal } from './CreateMatchModal';
import InvitationManagement from './InvitationManagement/InvitationManagement.jsx';
import { fetchData, postData } from '../../../../mocks/CallingAPI.js';

import { useScrollAnimation } from '../../../hooks/useAnimation';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Star,
  Filter,
  Search,
  MessageCircle,
  Trophy,
  Target,
  Zap,
  Crown,
  UserPlus,
  Heart,
  Award,
  Globe,
  TrendingUp
} from 'lucide-react';
import FindTeammateGround from '../../../assets/FindTeammateGround.jpg';
import { useAuth } from '../../../hooks/AuthContext/AuthContext';

import './FindTeammatePage.css';

export const FindTeammatePage = () => {
  const { user } = useAuth();
  
  // determine if this is a regular user
  const _role = String(user?.role || '').toLowerCase();
  const isRegularUser = ['customer', 'user', 'player'].includes(_role);
  const [activeTab, setActiveTab] = useState('find-matches'); // 'find-matches' or 'my-invitations'
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPlayerProfile, setShowPlayerProfile] = useState(null);
  const [showCreateMatchModal, setShowCreateMatchModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [userInvitations, setUserInvitations] = useState([]); // Danh sách các invitation user đã tham gia
  const [allUserInvitations, setAllUserInvitations] = useState([]); // Tất cả UserInvitations để đếm số người tham gia
  // Pagination for matches list
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Alert popup state
  const [alertPopup, setAlertPopup] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null
  });

  const heroRef = useScrollAnimation();
  const filtersRef = useScrollAnimation();
  const matchesRef = useScrollAnimation();
  const playersRef = useScrollAnimation();
  const communityRef = useScrollAnimation();

  const skillLevels = [
    { value: 'beginner', label: 'Mới bắt đầu', icon: Target, color: 'bg-green-500' },
    { value: 'intermediate', label: 'Trung bình', icon: Zap, color: 'bg-blue-500' },
    { value: 'advanced', label: 'Nâng cao', icon: Trophy, color: 'bg-purple-500' },
    { value: 'pro', label: 'Chuyên nghiệp', icon: Crown, color: 'bg-yellow-500' }
  ];

  const locations = [
    'Quận 1, TP. HCM',
    'Quận 3, TP. HCM',
    'Quận 7, TP. HCM',
    'Quận Bình Thạnh, TP. HCM',
    'TP. Thủ Đức, TP. HCM'
  ];

  const timeSlots = [
    'Buổi sáng (6:00 - 12:00)',
    'Buổi chiều (12:00 - 18:00)',
    'Buổi tối (18:00 - 22:00)'
  ];

  // Helper function to map Invitation API data to match card format
  const mapInvitationToMatchCard = (invitation, userInvitationsList = allUserInvitations) => {
    // Map standard to skill level
    const standardToSkill = {
      'Mới bắt đầu': 'beginner',
      'Trung bình': 'intermediate',
      'Nâng cao': 'advanced',
      'Chuyên nghiệp': 'pro'
    };

    // Đếm số người đã tham gia (UserInvitations có status = 1)
    const approvedPlayers = userInvitationsList.filter(
      ui => ui.invitationId === invitation.id && ui.status === 1
    ).length;

    const totalPlayers = invitation.totalPlayer || 0;
    const playersNeeded = Math.max(0, totalPlayers - approvedPlayers);

    return {
      id: invitation.id,
      title: invitation.name || 'Trận đấu',
      date: invitation.date,
      time: invitation.startTime && invitation.endTime 
        ? `${invitation.startTime.substring(0, 5)} - ${invitation.endTime.substring(0, 5)}`
        : '',
      location: invitation.location || '',
      playersNeeded: playersNeeded,
      currentPlayers: approvedPlayers,
      totalPlayers: totalPlayers,
      skillLevel: standardToSkill[invitation.standard] || 'intermediate',
      price: invitation.joiningCost || 0,
      organizer: {
        id: invitation.userId || '',
        name: 'Người tổ chức',
        avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        skillLevel: standardToSkill[invitation.standard] || 'intermediate',
        location: invitation.location?.split(',')[0] || '',
        bio: 'Tổ chức trận đấu',
        rating: 4.5
      }
    };
  };

  // Hàm fetch tất cả UserInvitations để đếm số người tham gia
  const fetchAllUserInvitations = async () => {
    try {
      const data = await fetchData('UserInvitation', user?.token);
      const allInvitations = Array.isArray(data) ? data : [];
      setAllUserInvitations(allInvitations);
    } catch (err) {
      console.error('Error fetching all user invitations:', err);
      setAllUserInvitations([]);
    }
  };

  // Hàm fetch UserInvitations để có thể gọi lại khi cần refresh
  const fetchUserInvitations = async () => {
    if (!user?.id || !user?.token) {
      setUserInvitations([]);
      return;
    }

    try {
      const data = await fetchData('UserInvitation', user.token);
      // Lọc chỉ lấy các invitation của user hiện tại
      const filtered = Array.isArray(data) 
        ? data.filter(ui => ui.userId === user.id)
        : [];
      setUserInvitations(filtered);
    } catch (err) {
      console.error('Error fetching user invitations:', err);
      setUserInvitations([]);
    }
  };

  // Fetch tất cả UserInvitations để đếm số người tham gia cho mỗi trận
  useEffect(() => {
    let cancelled = false;
    const loadAllUserInvitations = async () => {
      await fetchAllUserInvitations();
    };

    loadAllUserInvitations();
    return () => { cancelled = true; };
  }, []);

  // Fetch UserInvitations khi user đăng nhập để kiểm tra trạng thái tham gia
  useEffect(() => {
    if (!user?.id || !user?.token) {
      setUserInvitations([]);
      return;
    }

    let cancelled = false;
    const loadUserInvitations = async () => {
      await fetchUserInvitations();
    };

    loadUserInvitations();
    return () => { cancelled = true; };
  }, [user?.id, user?.token]);

  // Helper to map UI filters -> API params
  const levelToStandard = (lvl) => {
    const m = {
      beginner: 'Mới bắt đầu',
      intermediate: 'Trung bình',
      advanced: 'Nâng cao',
      pro: 'Chuyên nghiệp',
    };
    return m[lvl] || '';
  };

  // Map time slot to start/end range (server expects HH:mm:ss)
  const timeSlotToRange = (slot) => {
    switch (slot) {
      case 'Buổi sáng (6:00 - 12:00)':
        return { startTimeFrom: '06:00:00', startTimeTo: '12:00:00' };
      case 'Buổi chiều (12:00 - 18:00)':
        return { startTimeFrom: '12:00:00', startTimeTo: '18:00:00' };
      case 'Buổi tối (18:00 - 22:00)':
        return { startTimeFrom: '18:00:00', startTimeTo: '22:00:00' };
      default:
        return {};
    }
  };

  // Hàm fetch matches để có thể gọi lại khi cần refresh
  const fetchMatches = async () => {
    setLoading(true);
    try {
      // Fetch song song để tăng tốc độ
      const [allUserInvData, invitationData] = await Promise.all([
        fetchData('UserInvitation', user?.token),
        fetchData('Invitation', user?.token)
      ]);
      
      // Cập nhật allUserInvitations
      const allInvitations = Array.isArray(allUserInvData) ? allUserInvData : [];
      setAllUserInvitations(allInvitations);
      
      // Filter data on client side based on selected filters
      let filteredData = Array.isArray(invitationData) ? invitationData : [];
      
      // Filter by search query (name)
      if (searchQuery?.trim()) {
        const query = searchQuery.toLowerCase();
        filteredData = filteredData.filter(inv => 
          inv.name?.toLowerCase().includes(query)
        );
      }
      
      // Filter by skill level (standard)
      if (selectedSkillLevel) {
        const standard = levelToStandard(selectedSkillLevel);
        filteredData = filteredData.filter(inv => inv.standard === standard);
      }
      
      // Filter by location
      if (selectedLocation) {
        filteredData = filteredData.filter(inv => 
          inv.location?.includes(selectedLocation)
        );
      }
      
      // Filter by time slot
      if (selectedTime) {
        const timeRange = timeSlotToRange(selectedTime);
        if (timeRange.startTimeFrom && timeRange.startTimeTo) {
          filteredData = filteredData.filter(inv => {
            if (!inv.startTime) return false;
            return inv.startTime >= timeRange.startTimeFrom && 
                   inv.startTime <= timeRange.startTimeTo;
          });
        }
      }
      
      // Sắp xếp theo thời gian tạo mới nhất (ID lớn nhất hoặc createdAt nếu có)
      filteredData.sort((a, b) => {
        // Nếu có trường createdAt, sử dụng nó
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        // Nếu không có, sử dụng ID (giả định ID lớn hơn = mới hơn)
        return (b.id || 0) - (a.id || 0);
      });
      
      const mapped = filteredData.map(inv => mapInvitationToMatchCard(inv, allInvitations));
      setMatches(mapped);
    } catch (err) {
      console.error('Failed to load invitations with filters', err);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    let timer;
    const fetchWithFilters = async () => {
      await fetchMatches();
    };

    // Debounce to avoid spamming API when typing search
    timer = setTimeout(fetchWithFilters, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // Note: user?.token removed from dependencies since we don't need it for fetching
  }, [selectedSkillLevel, selectedLocation, selectedTime, searchQuery]);

  const handleJoinMatch = async (match) => {
    if (!user?.id || !user?.token) {
      setAlertPopup({
        isOpen: true,
        type: 'warning',
        title: 'Yêu cầu đăng nhập',
        message: 'Bạn cần đăng nhập để tham gia trận đấu',
        onConfirm: null
      });
      return;
    }
    
    try {
      // Create UserInvitation using CallingAPI according to documentation
      const userInvitationData = {
        userId: user.id,
        invitationId: Number(match.id),
        status: 0, // 0 = pending (chờ duyệt), người tạo trận sẽ duyệt sau
        joinDate: new Date().toISOString()
      };

      const newUserInvitation = await postData('UserInvitation', userInvitationData, user.token);
      
      console.log('Joined match successfully - waiting for approval');
      
      // Refresh dữ liệu để cập nhật trạng thái mới
      await Promise.all([
        fetchUserInvitations(),
        fetchAllUserInvitations(),
        fetchMatches()
      ]);
      
      setAlertPopup({
        isOpen: true,
        type: 'success',
        title: 'Đã gửi yêu cầu!',
        message: 'Yêu cầu tham gia đã được gửi. Vui lòng chờ người tạo trận duyệt.',
        onConfirm: null
      });
      
      // Không cập nhật số lượng người chơi ngay vì chưa được duyệt
      // Số lượng sẽ được cập nhật khi người tạo trận duyệt (status = 1)
      setSelectedMatch(null);
    } catch (err) {
      console.error('Join failed', err);
      setAlertPopup({
        isOpen: true,
        type: 'error',
        title: 'Có lỗi xảy ra',
        message: 'Không thể tham gia trận đấu. Vui lòng thử lại sau.',
        onConfirm: null
      });
    }
  };

  // Helper function để kiểm tra user đã tham gia trận nào và trạng thái
  const getUserInvitationStatus = (matchId) => {
    const userInv = userInvitations.find(ui => ui.invitationId === matchId);
    if (!userInv) return null;
    return {
      status: userInv.status, // 0 = pending, 1 = approved, 2 = rejected
      data: userInv
    };
  };

  const players = [
    {
      id: '1',
      name: 'Alex Johnson',
      avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      skillLevel: 'intermediate',
      location: 'Quận 1, TP. Hồ Chí Minh',
      bio: 'Tiền vệ đam mê với 8 năm kinh nghiệm. Yêu thích chiến thuật và phối hợp đồng đội.',
      rating: 4.8
    },
    {
      id: '2',
      name: 'Maria Santos',
      avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      skillLevel: 'beginner',
      location: 'Quận 7, TP. Hồ Chí Minh',
      bio: 'Mới chơi bóng nhưng rất ham học hỏi! Tìm kiếm trận giao hữu và đồng đội kiên nhẫn.',
      rating: 4.5
    },
    {
      id: '3',
      name: 'David Kim',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      skillLevel: 'advanced',
      location: 'TP. Thủ Đức, TP. Hồ Chí Minh',
      bio: 'Tiền đạo bán chuyên. Dứt điểm tốt và tốc độ. Tìm kiếm trận đấu cạnh tranh.',
      rating: 4.9
    },
    {
      id: '4',
      name: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      skillLevel: 'pro',
      location: 'Quận 3, TP. Hồ Chí Minh',
      bio: 'Hậu vệ chuyên nghiệp từng thi đấu đội tuyển quốc gia. Kỹ thuật và lãnh đạo tốt.',
      rating: 5.0
    },
    {
      id: '5',
      name: 'Michael Torres',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      skillLevel: 'intermediate',
      location: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
      bio: 'Cầu thủ đa năng, chơi được nhiều vị trí. Đồng đội tốt, tinh thần tích cực.',
      rating: 4.7
    },
    {
      id: '6',
      name: 'Emma Wilson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      skillLevel: 'advanced',
      location: 'Quận 1, TP. Hồ Chí Minh',
      bio: 'Tiền vệ sáng tạo, chuyền bóng tốt. Yêu thích tổ chức lối chơi và tạo cơ hội.',
      rating: 4.8
    }
  ];

  const filteredMatches = matches.filter(match => {
    const icIncludes = (a = '', b = '') =>
      String(a).toLowerCase().includes(String(b).toLowerCase());

    const toSec = (t) => {
      if (!t) return null;
      const s = String(t).trim();
      const parts = s.split(':');
      if (parts.length < 2) return null;
      const hh = Number(parts[0]);
      const mm = Number(parts[1]);
      const ss = parts.length >= 3 ? Number(parts[2]) : 0;
      if ([hh, mm, ss].some((x) => Number.isNaN(x))) return null;
      return hh * 3600 + mm * 60 + ss;
    };

    const timeRangeFromSlot = (slot) => {
      switch (slot) {
        case 'Buổi sáng (6:00 - 12:00)':
          return { from: toSec('06:00:00'), to: toSec('12:00:00') };
        case 'Buổi chiều (12:00 - 18:00)':
          return { from: toSec('12:00:00'), to: toSec('18:00:00') };
        case 'Buổi tối (18:00 - 22:00)':
          return { from: toSec('18:00:00'), to: toSec('22:00:00') };
        default:
          return { from: null, to: null };
      }
    };

    const skillMatch = !selectedSkillLevel || match.skillLevel === selectedSkillLevel;
    // Case-insensitive contains for location filter (dropdown)
    const locationMatch = !selectedLocation || icIncludes(match.location, selectedLocation);
    // Search by title OR location (case-insensitive contains)
    const searchMatch = !searchQuery || icIncludes(match.title, searchQuery) || icIncludes(match.location, searchQuery);
    // Time filter against Invitation.StartTime (normalized in raw.startTime)
    const { from, to } = timeRangeFromSlot(selectedTime);
    const matchStart = toSec(match.raw?.startTime || match.raw?.StartTime || null);
    const timeMatch = !from || !to || (matchStart !== null && matchStart >= from && matchStart <= to);

    return skillMatch && locationMatch && searchMatch && timeMatch;
  });

  // Ensure current page stays valid when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSkillLevel, selectedLocation, selectedTime, searchQuery, matches.length]);

  const totalPages = Math.max(1, Math.ceil(filteredMatches.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMatches = filteredMatches.slice(startIndex, startIndex + pageSize);

  const filteredPlayers = players.filter(player => {
    const icIncludes = (a = '', b = '') =>
      String(a).toLowerCase().includes(String(b).toLowerCase());
    const skillMatch = !selectedSkillLevel || player.skillLevel === selectedSkillLevel;
    // Case-insensitive contains for location filter (dropdown)
    const locationMatch = !selectedLocation || icIncludes(player.location, selectedLocation);
    // Search by name OR location (case-insensitive contains)
    const searchMatch = !searchQuery || icIncludes(player.name, searchQuery) || icIncludes(player.location, searchQuery);
    return skillMatch && locationMatch && searchMatch;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  const getSkillColor = (level) => {
    const skill = skillLevels.find(s => s.value === level);
    return skill ? skill.color : 'bg-gray-500';
  };

  const getSkillIcon = (level) => {
    const skill = skillLevels.find(s => s.value === level);
    return skill ? skill.icon : Target;
  };

  return (
    <div className="find-teammate-page">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="find-teammate-page__hero"
      >
        <div className="find-teammate-page__hero-bg" style={{ backgroundImage: `url(${FindTeammateGround})` }} />
        <div className="find-teammate-page__hero-overlay" />
        
        <div className="find-teammate-page__hero-content">
          <div className="find-teammate-page__hero-text">
            <h1 className="find-teammate-page__hero-title">
              Tìm Đội Bóng
              <span className="find-teammate-page__hero-title-highlight">Phù Hợp</span>
            </h1>
            <p className="find-teammate-page__hero-description">
              Kết nối với cầu thủ cùng trình độ, tham gia trận đấu hấp dẫn và xây dựng tình bạn lâu dài qua bóng đá.
            </p>
            <div className="find-teammate-page__hero-buttons">
              <Button size="lg" glow className="find-teammate-page__hero-button-primary">
                <Users className="find-teammate-page__hero-button-icon" size={20} />
                Tham Gia Cộng Đồng
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="find-teammate-page__hero-button-secondary"
                onClick={() => setShowCreateMatchModal(true)}
              >
                <Heart className="find-teammate-page__hero-button-icon" size={20} />
                Tạo Trận Đấu
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="find-teammate-page__container">
        {/* Tab Navigation */}
        <div className="find-teammate-page__tabs">
          <button
            className={`find-teammate-page__tab ${activeTab === 'find-matches' ? 'find-teammate-page__tab--active' : ''}`}
            onClick={() => setActiveTab('find-matches')}
          >
            <Search size={20} />
            <span>Tìm Trận Đấu</span>
          </button>
          {user && (
            <button
              className={`find-teammate-page__tab ${activeTab === 'my-invitations' ? 'find-teammate-page__tab--active' : ''}`}
              onClick={() => setActiveTab('my-invitations')}
            >
              <Trophy size={20} />
              <span>Quản Lý Lời Mời</span>
            </button>
          )}
        </div>

        {/* Conditional Content */}
        {activeTab === 'find-matches' ? (
          <>
            {/* Search and Filters */}
            <Card ref={filtersRef} className="find-teammate-page__filters">
              <div className="find-teammate-page__filters-header">
                <div className="find-teammate-page__filters-icon-wrapper">
                  <Filter size={24} className="find-teammate-page__filters-icon" />
                </div>
                <h2 className="find-teammate-page__filters-title">Tìm trận đấu phù hợp</h2>
              </div>

              <div className="find-teammate-page__filters-grid">
                {/* Search */}
                <div className="find-teammate-page__search-wrapper">
                  <Search className="find-teammate-page__search-icon" size={20} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm trận đấu hoặc cầu thủ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="find-teammate-page__search-input"
                  />
                </div>

                {/* Skill Level */}
                <select
                  value={selectedSkillLevel}
                  onChange={(e) => setSelectedSkillLevel(e.target.value)}
                  className="find-teammate-page__select"
                >
                  <option value="">Tất cả trình độ</option>
                  {skillLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>

                {/* Location */}
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="find-teammate-page__select"
                >
                  <option value="">Tất cả khu vực</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>

                {/* Time */}
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="find-teammate-page__select"
                >
                  <option value="">Mọi khung giờ</option>
                  {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </Card>

        <div className="find-teammate-page__main-content">
          {/* Matches Section - Left Side */}
          <div className="find-teammate-page__matches-section">
            <div ref={matchesRef} className="find-teammate-page__section-header">
              <h2 className="find-teammate-page__section-title">
                <div className="find-teammate-page__section-title-icon">
                  <Trophy size={24} />
                </div>
                Trận đấu sắp tới ({filteredMatches.length})
              </h2>
              <p className="find-teammate-page__section-subtitle">
                Tham gia ngay để không bỏ lỡ những trận đấu hấp dẫn
              </p>
            </div>

            <div className="find-teammate-page__matches-list">
              {paginatedMatches.map((match, index) => {
                const SkillIcon = getSkillIcon(match.skillLevel);
                const userInvStatus = getUserInvitationStatus(match.id);
                const isJoined = !!userInvStatus;
                const isPending = userInvStatus?.status === 0;
                const isApproved = userInvStatus?.status === 1;
                
                return (
                  <Card 
                    key={match.id} 
                    className="find-teammate-page__match-card"
                    onClick={() => setSelectedMatch(match)}
                  >
                    <div className="find-teammate-page__match-card-header">
                      <div className="find-teammate-page__match-info">
                        <h3 className="find-teammate-page__match-title">{match.title}</h3>
                        <div className="find-teammate-page__match-details-grid">
                          <div className="find-teammate-page__match-detail">
                            <Calendar size={16} className="find-teammate-page__match-detail-icon" />
                            <span>{new Date(match.date).toLocaleDateString()}</span>
                          </div>
                          <div className="find-teammate-page__match-detail">
                            <Clock size={16} className="find-teammate-page__match-detail-icon" />
                            <span>{match.time}</span>
                          </div>
                          <div className="find-teammate-page__match-detail">
                            <MapPin size={16} className="find-teammate-page__match-detail-icon" />
                            <span>{match.location}</span>
                          </div>
                          <div className="find-teammate-page__match-detail">
                            <Users size={16} className="find-teammate-page__match-detail-icon" />
                            <span>{match.currentPlayers}/{match.totalPlayers || 22} cầu thủ</span>
                          </div>
                        </div>
                      </div>
                      <div className="find-teammate-page__match-meta">
                        <div className={`find-teammate-page__match-skill ${getSkillColor(match.skillLevel)}`}>
                          <SkillIcon size={16} />
                          <span>{match.skillLevel}</span>
                        </div>
                        <div className="find-teammate-page__match-price">
                          {formatPrice(match.price)}
                        </div>
                      </div>
                    </div>

                    <div className="find-teammate-page__match-card-footer">
                      <div className="find-teammate-page__match-organizer">
                        <img
                          src={match.organizer.avatar}
                          alt={match.organizer.name}
                          className="find-teammate-page__organizer-avatar"
                        />
                        <div className="find-teammate-page__organizer-info">
                          <p className="find-teammate-page__organizer-name">{match.organizer.name}</p>
                          <div className="find-teammate-page__organizer-rating">
                            <Star size={14} className="find-teammate-page__organizer-star" />
                            <span>{match.organizer.rating} điểm</span>
                          </div>
                        </div>
                      </div>

                      <div className="find-teammate-page__match-actions">
                        <div className={`find-teammate-page__match-status ${
                          match.playersNeeded === 0 
                            ? 'find-teammate-page__match-status--full'
                            : isPending
                            ? 'find-teammate-page__match-status--pending'
                            : isApproved
                            ? 'find-teammate-page__match-status--approved' 
                            : 'find-teammate-page__match-status--available'
                        }`}>
                          {isPending ? 'Đang chờ duyệt' : isApproved ? 'Đã tham gia' : match.playersNeeded === 0 ? 'Đã đủ' : `${match.playersNeeded} chỗ trống`}
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMatch(match);
                          }}
                          disabled={match.playersNeeded === 0 || isJoined}
                          className="find-teammate-page__match-join-btn"
                        >
                          {isPending ? 'Đang chờ duyệt' : isApproved ? 'Đã tham gia' : 'Tham gia trận đấu'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            {/* Pagination Controls */}
            {filteredMatches.length > pageSize && (
              <div className="find-teammate-page__pagination">
                <button
                  className="find-teammate-page__pagination-button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Trước
                </button>
                <div className="find-teammate-page__pagination-pages">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`find-teammate-page__pagination-page ${page === currentPage ? 'is-active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  className="find-teammate-page__pagination-button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Sau
                </button>
              </div>
            )}
          </div>

          {/* Players Section - Right Side */}
          <div className="find-teammate-page__players-section">
            <div ref={playersRef} className="find-teammate-page__section-header">
              <h2 className="find-teammate-page__section-title">
                <div className="find-teammate-page__section-title-icon">
                  <UserPlus size={24} />
                </div>
                Cầu thủ nổi bật
              </h2>
              <p className="find-teammate-page__section-subtitle">
                Kết nối với những cầu thủ có cùng đam mê
              </p>
            </div>

            <div className="find-teammate-page__players-list">
              {filteredPlayers.slice(0, 6).map((player, index) => {
                const SkillIcon = getSkillIcon(player.skillLevel);
                return (
                  <Card 
                    key={player.id} 
                    className="find-teammate-page__player-card"
                    onClick={() => setShowPlayerProfile(player)}
                  >
                    <div className="find-teammate-page__player-header">
                      <img
                        src={player.avatar}
                        alt={player.name}
                        className="find-teammate-page__player-avatar"
                      />
                      <div className="find-teammate-page__player-info">
                        <h3 className="find-teammate-page__player-name">{player.name}</h3>
                        <div className="find-teammate-page__player-location">
                          <MapPin size={12} />
                          <span>{player.location.split(',')[0]}</span>
                        </div>
                      </div>
                      <div className="find-teammate-page__player-meta">
                        <div className={`find-teammate-page__player-skill ${getSkillColor(player.skillLevel)}`}>
                          <SkillIcon size={12} />
                        </div>
                        <div className="find-teammate-page__player-rating">
                          <Star size={12} className="find-teammate-page__player-rating-star" />
                          <span>{player.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Community CTA */}
        <section ref={communityRef} className="find-teammate-page__community">
          <div className="find-teammate-page__community-content">
            <div className="find-teammate-page__community-icon">
              <Globe size={48} />
            </div>
            <h2 className="find-teammate-page__community-title">
              Tham gia cộng đồng cầu thủ Xnova
            </h2>
            <p className="find-teammate-page__community-subtitle">
              Kết nối với hơn 10.000+ người yêu bóng đá, tổ chức trận đấu và nâng tầm kỹ năng của bạn.
            </p>
            <div className="find-teammate-page__community-actions">
              <Button size="lg" glow>
                <TrendingUp size={20} />
                Tham gia cộng đồng
              </Button>
              <Button size="lg" variant="outline">
                <Award size={20} />
                Tạo trận đấu
              </Button>
            </div>
          </div>
        </section>
          </>
        ) : (
          /* My Invitations Tab */
          <div className="find-teammate-page__invitations-wrapper">
            <InvitationManagement />
          </div>
        )}
      </div>

      {/* Match Details Modal */}
      {selectedMatch && (() => {
        const userInvStatus = getUserInvitationStatus(selectedMatch.id);
        const isJoined = !!userInvStatus;
        const isPending = userInvStatus?.status === 0;
        const isApproved = userInvStatus?.status === 1;
        
        return (
        <Modal
          isOpen={!!selectedMatch}
          onClose={() => setSelectedMatch(null)}
          title="Chi tiết trận đấu"
        >
          <div className="find-teammate-page__match-modal">
            <div className="find-teammate-page__modal-header">
              <h3 className="find-teammate-page__modal-title">{selectedMatch.title}</h3>
              <div className={`find-teammate-page__modal-skill ${getSkillColor(selectedMatch.skillLevel)}`}>
                {React.createElement(getSkillIcon(selectedMatch.skillLevel), { size: 20 })}
                {selectedMatch.skillLevel.charAt(0).toUpperCase() + selectedMatch.skillLevel.slice(1)} Trình độ
              </div>
            </div>

            <div className="find-teammate-page__modal-details-grid">
              <div className="find-teammate-page__modal-detail">
                <Calendar className="find-teammate-page__modal-detail-icon" size={20} />
                <div>
                  <div className="find-teammate-page__modal-detail-label">Ngày</div>
                  <div className="find-teammate-page__modal-detail-value">{new Date(selectedMatch.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="find-teammate-page__modal-detail">
                <Clock className="find-teammate-page__modal-detail-icon" size={20} />
                <div>
                  <div className="find-teammate-page__modal-detail-label">Giờ</div>
                  <div className="find-teammate-page__modal-detail-value">{selectedMatch.time}</div>
                </div>
              </div>
              <div className="find-teammate-page__modal-detail">
                <MapPin className="find-teammate-page__modal-detail-icon" size={20} />
                <div>
                  <div className="find-teammate-page__modal-detail-label">Khu vực</div>
                  <div className="find-teammate-page__modal-detail-value">{selectedMatch.location}</div>
                </div>
              </div>
              <div className="find-teammate-page__modal-detail">
                <Users className="find-teammate-page__modal-detail-icon" size={20} />
                <div>
                  <div className="find-teammate-page__modal-detail-label">Cầu thủ</div>
                  <div className="find-teammate-page__modal-detail-value">{selectedMatch.currentPlayers}/{selectedMatch.totalPlayers || 22}</div>
                </div>
              </div>
            </div>

            <div className="find-teammate-page__modal-organizer">
              <h4 className="find-teammate-page__modal-organizer-title">Người tổ chức</h4>
              <div className="find-teammate-page__modal-organizer-info">
                <img
                  src={selectedMatch.organizer.avatar}
                  alt={selectedMatch.organizer.name}
                  className="find-teammate-page__modal-organizer-avatar"
                />
                <div className="find-teammate-page__modal-organizer-details">
                  <div className="find-teammate-page__modal-organizer-name">{selectedMatch.organizer.name}</div>
                  <div className="find-teammate-page__modal-organizer-rating">
                    <Star size={14} className="find-teammate-page__modal-organizer-star" />
                    <span>{selectedMatch.organizer.rating} điểm</span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <MessageCircle size={16} />
                  Nhắn tin
                </Button>
              </div>
            </div>

            <div className="find-teammate-page__modal-price">
              <span className="find-teammate-page__modal-price-label">Phí tham gia:</span>
              <span className="find-teammate-page__modal-price-value">{formatPrice(selectedMatch.price)}</span>
            </div>

            <div className="find-teammate-page__modal-actions">
              <Button 
                size="lg" 
                glow
                disabled={selectedMatch.playersNeeded === 0 || isJoined}
                onClick={() => handleJoinMatch(selectedMatch)}
              >
                {isPending ? 'Đang chờ duyệt' : isApproved ? 'Đã tham gia' : selectedMatch.playersNeeded === 0 ? 'Đã đủ' : 'Tham gia trận đấu'}
              </Button>
              <Button variant="outline" size="lg">
                <MessageCircle size={20} />
                Nhắn tin
              </Button>
            </div>
          </div>
        </Modal>
        );
      })()}

      {/* Player Profile Modal */}
      {showPlayerProfile && (
        <Modal
          isOpen={!!showPlayerProfile}
          onClose={() => setShowPlayerProfile(null)}
          title="Hồ sơ cầu thủ"
        >
          <div className="find-teammate-page__player-modal">
            <div className="find-teammate-page__modal-player-header">
              <img
                src={showPlayerProfile.avatar}
                alt={showPlayerProfile.name}
                className="find-teammate-page__modal-player-avatar"
              />
              <div className="find-teammate-page__modal-player-info">
                <h3 className="find-teammate-page__modal-player-name">{showPlayerProfile.name}</h3>
                <div className={`find-teammate-page__modal-player-skill ${getSkillColor(showPlayerProfile.skillLevel)}`}>
                  {React.createElement(getSkillIcon(showPlayerProfile.skillLevel), { size: 20 })}
                  {showPlayerProfile.skillLevel.charAt(0).toUpperCase() + showPlayerProfile.skillLevel.slice(1)} Cầu thủ
                </div>
              </div>
            </div>

            <div className="find-teammate-page__modal-player-stats">
              <div className="find-teammate-page__modal-player-stat">
                <Star className="find-teammate-page__modal-player-stat-icon" size={20} />
                <span className="find-teammate-page__modal-player-stat-value">{showPlayerProfile.rating}</span>
                <span className="find-teammate-page__modal-player-stat-label">Đánh giá</span>
              </div>
              <div className="find-teammate-page__modal-player-stat">
                <MapPin className="find-teammate-page__modal-player-stat-icon" size={20} />
                <span className="find-teammate-page__modal-player-stat-label">{showPlayerProfile.location}</span>
              </div>
            </div>

            <div className="find-teammate-page__modal-player-bio">
              <h4 className="find-teammate-page__modal-player-bio-title">Giới thiệu</h4>
              <p className="find-teammate-page__modal-player-bio-text">{showPlayerProfile.bio}</p>
            </div>

            <div className="find-teammate-page__modal-actions">
              <Button 
                size="lg" 
                glow
                onClick={() => {
                  setAlertPopup({
                    isOpen: true,
                    type: 'success',
                    title: 'Thành công',
                    message: 'Đã gửi lời mời kết bạn!',
                    onConfirm: null
                  });
                  setShowPlayerProfile(null);
                }}
              >
                <UserPlus size={20} />
                Mời tham gia trận
              </Button>
              <Button variant="outline" size="lg">
                <MessageCircle size={20} />
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Match Modal */}
      <CreateMatchModal
        isOpen={showCreateMatchModal}
        onClose={() => setShowCreateMatchModal(false)}
        onSuccess={async (newMatch) => {
          console.log('Match created successfully:', newMatch);
          
          // Refresh dữ liệu để hiển thị trận đấu mới tạo
          await Promise.all([
            fetchAllUserInvitations(),
            fetchMatches()
          ]);
          
          setAlertPopup({
            isOpen: true,
            type: 'success',
            title: 'Thành công',
            message: 'Trận đấu đã được tạo thành công!',
            onConfirm: null
          });
        }}
      />

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
    </div>
  );
};

export default FindTeammatePage;
