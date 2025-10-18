import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
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
        name: 'Son Tung MTP',
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
    },
    {
      id: '3',
      title: 'Trận đấu cạnh tranh',
      date: '2025-01-17',
      time: '20:00',
      location: 'TP. Thủ Đức, TP. Hồ Chí Minh',
      playersNeeded: 1,
      currentPlayers: 21,
      skillLevel: 'advanced',
      price: 150000,
      organizer: {
        id: '3',
        name: 'David Kim',
        avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        skillLevel: 'advanced',
        location: 'TP. Thủ Đức',
        bio: 'Cựu cầu thủ bán chuyên, tư duy chiến thuật',
        rating: 4.9
      }
    }
  ];

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
    const skillMatch = !selectedSkillLevel || match.skillLevel === selectedSkillLevel;
    const locationMatch = !selectedLocation || match.location.includes(selectedLocation);
    const searchMatch = !searchQuery || match.title.toLowerCase().includes(searchQuery.toLowerCase());
    return skillMatch && locationMatch && searchMatch;
  });

  const filteredPlayers = players.filter(player => {
    const skillMatch = !selectedSkillLevel || player.skillLevel === selectedSkillLevel;
    const locationMatch = !selectedLocation || player.location.includes(selectedLocation);
    const searchMatch = !searchQuery || player.name.toLowerCase().includes(searchQuery.toLowerCase());
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
              {filteredMatches.map((match, index) => {
                const SkillIcon = getSkillIcon(match.skillLevel);
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
                            <span>{match.currentPlayers}/22 cầu thủ</span>
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
                            : 'find-teammate-page__match-status--available'
                        }`}>
                          {match.playersNeeded === 0 ? 'Đã đủ' : `${match.playersNeeded} chỗ trống`}
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMatch(match);
                          }}
                          disabled={match.playersNeeded === 0}
                          className="find-teammate-page__match-join-btn"
                        >
                          Tham gia trận đấu
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
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
      </div>

      {/* Match Details Modal */}
      {selectedMatch && (
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
                  <div className="find-teammate-page__modal-detail-value">{selectedMatch.currentPlayers}/22</div>
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
                disabled={selectedMatch.playersNeeded === 0}
                onClick={() => {
                  alert('Tham gia trận đấu thành công!');
                  setSelectedMatch(null);
                }}
              >
                {selectedMatch.playersNeeded === 0 ? 'Đã đủ' : 'Tham gia trận đấu'}
              </Button>
              <Button variant="outline" size="lg">
                <MessageCircle size={20} />
                Nhắn tin
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
                  alert('Đã gửi lời mời kết bạn!');
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
    </div>
  );
};

export default FindTeammatePage;
