import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { useScrollAnimation } from '../hooks/useAnimation';
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
import FindTeammateGround from '../assets/FindTeammateGround.jpg';
import './FindTeammatePage.css';

export const FindTeammatePage = () => {
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPlayerProfile, setShowPlayerProfile] = useState(null);

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
    'Quận 1, TP. Hồ Chí Minh',
    'Quận 3, TP. Hồ Chí Minh',
    'Quận 7, TP. Hồ Chí Minh',
    'Quận Bình Thạnh, TP. Hồ Chí Minh',
    'TP. Thủ Đức, TP. Hồ Chí Minh'
  ];

  const timeSlots = [
    'Buổi sáng (6:00 - 12:00)',
    'Buổi chiều (12:00 - 18:00)',
    'Buổi tối (18:00 - 22:00)'
  ];

  const matches = [
    {
      id: '1',
      title: 'Trận đấu Chủ Nhật',
      date: '2025-01-15',
      time: '16:00',
      location: 'Quận 1, TP. Hồ Chí Minh',
      playersNeeded: 3,
      currentPlayers: 8,
      skillLevel: 'intermediate',
      price: 100000,
      organizer: {
        id: '1',
        name: 'Alex Johnson',
        avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        skillLevel: 'intermediate',
        location: 'Quận 1',
        bio: 'Đam mê bóng đá, chơi 8 năm',
        rating: 4.8
      }
    },
    {
      id: '2',
      title: 'Giao hữu 7v7',
      date: '2025-01-16',
      time: '18:30',
      location: 'Quận 7, TP. Hồ Chí Minh',
      playersNeeded: 2,
      currentPlayers: 12,
      skillLevel: 'beginner',
      price: 75000,
      organizer: {
        id: '2',
        name: 'Maria Santos',
        avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        skillLevel: 'beginner',
        location: 'Quận 7',
        bio: 'Mới bắt đầu chơi, rất yêu bóng đá!',
        rating: 4.5
      }
    }
  ];

  const players = [
    {
      id: '1',
      name: 'Minh Tuấn',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      skillLevel: 'advanced',
      location: 'Quận 1',
      bio: 'Tiền đạo, chơi 10 năm kinh nghiệm',
      rating: 4.9,
      gamesPlayed: 156,
      availability: 'Sẵn sàng'
    },
    {
      id: '2',
      name: 'Văn Long',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      skillLevel: 'intermediate',
      location: 'Quận 7',
      bio: 'Thủ môn, thích làm việc nhóm',
      rating: 4.7,
      gamesPlayed: 89,
      availability: 'Cuối tuần'
    }
  ];

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
              <Button variant="outline" size="lg" className="find-teammate-page__hero-button-secondary">
                <Heart className="find-teammate-page__hero-button-icon" size={20} />
                Tạo Trận Đấu
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="find-teammate-page__container">
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
              <option value="">Mọi thời gian</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Matches Section */}
        <section ref={matchesRef} className="find-teammate-page__matches">
          <div className="find-teammate-page__section-header">
            <h2 className="find-teammate-page__section-title">
              <Trophy className="find-teammate-page__section-icon" />
              Trận đấu sắp tới
            </h2>
            <p className="find-teammate-page__section-subtitle">
              Tham gia ngay để không bỏ lỡ những trận đấu hấp dẫn
            </p>
          </div>

          <div className="find-teammate-page__matches-grid">
            {matches.map((match) => {
              const SkillIcon = getSkillIcon(match.skillLevel);
              return (
                <Card key={match.id} className="find-teammate-page__match-card">
                  <div className="find-teammate-page__match-header">
                    <h3 className="find-teammate-page__match-title">{match.title}</h3>
                    <div className={`find-teammate-page__match-skill ${getSkillColor(match.skillLevel)}`}>
                      <SkillIcon size={16} />
                      <span>{skillLevels.find(s => s.value === match.skillLevel)?.label}</span>
                    </div>
                  </div>

                  <div className="find-teammate-page__match-details">
                    <div className="find-teammate-page__match-detail">
                      <Calendar size={16} className="find-teammate-page__match-detail-icon" />
                      <span>{match.date}</span>
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
                      <span>Cần {match.playersNeeded} người ({match.currentPlayers} đã tham gia)</span>
                    </div>
                  </div>

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
                        <span>{match.organizer.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="find-teammate-page__match-footer">
                    <div className="find-teammate-page__match-price">
                      {formatPrice(match.price)}
                    </div>
                    <Button
                      onClick={() => setSelectedMatch(match)}
                      className="find-teammate-page__match-join-btn"
                    >
                      <UserPlus size={16} />
                      Tham gia
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Players Section */}
        <section ref={playersRef} className="find-teammate-page__players">
          <div className="find-teammate-page__section-header">
            <h2 className="find-teammate-page__section-title">
              <Users className="find-teammate-page__section-icon" />
              Cầu thủ nổi bật
            </h2>
            <p className="find-teammate-page__section-subtitle">
              Kết nối với những cầu thủ có cùng đam mê
            </p>
          </div>

          <div className="find-teammate-page__players-grid">
            {players.map((player) => {
              const SkillIcon = getSkillIcon(player.skillLevel);
              return (
                <Card key={player.id} className="find-teammate-page__player-card">
                  <div className="find-teammate-page__player-header">
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="find-teammate-page__player-avatar"
                    />
                    <div className="find-teammate-page__player-info">
                      <h3 className="find-teammate-page__player-name">{player.name}</h3>
                      <div className="find-teammate-page__player-location">
                        <MapPin size={14} />
                        <span>{player.location}</span>
                      </div>
                    </div>
                    <div className={`find-teammate-page__player-skill ${getSkillColor(player.skillLevel)}`}>
                      <SkillIcon size={16} />
                    </div>
                  </div>

                  <p className="find-teammate-page__player-bio">{player.bio}</p>

                  <div className="find-teammate-page__player-stats">
                    <div className="find-teammate-page__player-stat">
                      <Star size={16} className="find-teammate-page__player-stat-icon" />
                      <span>{player.rating}</span>
                    </div>
                    <div className="find-teammate-page__player-stat">
                      <Trophy size={16} className="find-teammate-page__player-stat-icon" />
                      <span>{player.gamesPlayed} trận</span>
                    </div>
                    <div className="find-teammate-page__player-stat">
                      <Clock size={16} className="find-teammate-page__player-stat-icon" />
                      <span>{player.availability}</span>
                    </div>
                  </div>

                  <div className="find-teammate-page__player-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPlayerProfile(player)}
                      className="find-teammate-page__player-view-btn"
                    >
                      Xem hồ sơ
                    </Button>
                    <Button
                      size="sm"
                      className="find-teammate-page__player-connect-btn"
                    >
                      <MessageCircle size={16} />
                      Kết nối
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Community Section */}
        <section ref={communityRef} className="find-teammate-page__community">
          <div className="find-teammate-page__community-content">
            <div className="find-teammate-page__community-stats">
              <h2 className="find-teammate-page__community-title">Cộng đồng Xnova</h2>
              <p className="find-teammate-page__community-subtitle">
                Tham gia cộng đồng bóng đá lớn nhất Việt Nam
              </p>
              
              <div className="find-teammate-page__stats-grid">
                <div className="find-teammate-page__stat-item">
                  <Users className="find-teammate-page__stat-icon" />
                  <div className="find-teammate-page__stat-content">
                    <div className="find-teammate-page__stat-number">15k+</div>
                    <div className="find-teammate-page__stat-label">Cầu thủ</div>
                  </div>
                </div>
                <div className="find-teammate-page__stat-item">
                  <Trophy className="find-teammate-page__stat-icon" />
                  <div className="find-teammate-page__stat-content">
                    <div className="find-teammate-page__stat-number">2.5k+</div>
                    <div className="find-teammate-page__stat-label">Trận đấu/tháng</div>
                  </div>
                </div>
                <div className="find-teammate-page__stat-item">
                  <Star className="find-teammate-page__stat-icon" />
                  <div className="find-teammate-page__stat-content">
                    <div className="find-teammate-page__stat-number">4.9/5</div>
                    <div className="find-teammate-page__stat-label">Đánh giá</div>
                  </div>
                </div>
                <div className="find-teammate-page__stat-item">
                  <Globe className="find-teammate-page__stat-icon" />
                  <div className="find-teammate-page__stat-content">
                    <div className="find-teammate-page__stat-number">50+</div>
                    <div className="find-teammate-page__stat-label">Sân bóng</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Match Detail Modal */}
      {selectedMatch && (
        <Modal
          isOpen={!!selectedMatch}
          onClose={() => setSelectedMatch(null)}
          title="Chi tiết trận đấu"
        >
          <div className="find-teammate-page__match-modal">
            <h3 className="find-teammate-page__modal-title">{selectedMatch.title}</h3>
            <div className="find-teammate-page__modal-details">
              <p><strong>Ngày:</strong> {selectedMatch.date}</p>
              <p><strong>Giờ:</strong> {selectedMatch.time}</p>
              <p><strong>Địa điểm:</strong> {selectedMatch.location}</p>
              <p><strong>Giá:</strong> {formatPrice(selectedMatch.price)}</p>
              <p><strong>Cần:</strong> {selectedMatch.playersNeeded} người</p>
            </div>
            <div className="find-teammate-page__modal-actions">
              <Button
                onClick={() => {
                  alert('Tham gia trận đấu thành công!');
                  setSelectedMatch(null);
                }}
                className="find-teammate-page__modal-join-btn"
              >
                Xác nhận tham gia
              </Button>
            </div>
          </div>
        </Modal>
      )}

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
              <div>
                <h3 className="find-teammate-page__modal-player-name">{showPlayerProfile.name}</h3>
                <p className="find-teammate-page__modal-player-location">{showPlayerProfile.location}</p>
              </div>
            </div>
            <p className="find-teammate-page__modal-player-bio">{showPlayerProfile.bio}</p>
            <div className="find-teammate-page__modal-player-stats">
              <div className="find-teammate-page__modal-stat">
                <Star size={20} className="find-teammate-page__modal-stat-icon" />
                <span>Đánh giá: {showPlayerProfile.rating}/5</span>
              </div>
              <div className="find-teammate-page__modal-stat">
                <Trophy size={20} className="find-teammate-page__modal-stat-icon" />
                <span>Đã chơi: {showPlayerProfile.gamesPlayed} trận</span>
              </div>
            </div>
            <div className="find-teammate-page__modal-actions">
              <Button
                onClick={() => {
                  alert('Đã gửi lời mời kết bạn!');
                  setShowPlayerProfile(null);
                }}
                className="find-teammate-page__modal-connect-btn"
              >
                <MessageCircle size={16} />
                Kết nối
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FindTeammatePage;
