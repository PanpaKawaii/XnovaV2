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
import { Match, Player } from '../types';

export const FindTeammatePage: React.FC = () => {
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPlayerProfile, setShowPlayerProfile] = useState<Player | null>(null);

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

  const matches: Match[] = [
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

  const players: Player[] = [
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  const getSkillColor = (level: string) => {
    const skill = skillLevels.find(s => s.value === level);
    return skill ? skill.color : 'bg-gray-500';
  };

  const getSkillIcon = (level: string) => {
    const skill = skillLevels.find(s => s.value === level);
    return skill ? skill.icon : Target;
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative bg-gradient-to-br from-[#A259FF] via-purple-600 to-purple-800 text-white py-16 lg:py-24 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-in fade-in slide-in-from-bottom duration-1000">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Tìm Đội Bóng
              <span className="block text-[#A8FF00] animate-pulse">Phù Hợp</span>
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Kết nối với cầu thủ cùng trình độ, tham gia trận đấu hấp dẫn và xây dựng tình bạn lâu dài qua bóng đá.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" glow className="bg-[#A8FF00] text-black hover:bg-[#96E600]">
                <Users className="mr-2" size={20} />
                Tham Gia Cộng Đồng
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-800">
                <Heart className="mr-2" size={20} />
                Tạo Trận Đấu
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <Card ref={filtersRef} className="p-6 mb-12 animate-in fade-in slide-in-from-top duration-1000">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#A8FF00] p-2 rounded-lg">
              <Filter size={24} className="text-black" />
            </div>
            <h2 className="text-2xl font-bold text-light-text dark:text-white">Tìm trận đấu phù hợp</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary dark:text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm trận đấu hoặc cầu thủ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-light-text dark:text-white placeholder-light-text-secondary dark:placeholder-gray-400 rounded-xl focus:border-[#A8FF00] focus:ring-2 focus:ring-[#A8FF00]/20 outline-none transition-all duration-300"
              />
            </div>

            {/* Skill Level */}
            <select
              value={selectedSkillLevel}
              onChange={(e) => setSelectedSkillLevel(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-light-text dark:text-white rounded-xl focus:border-[#A8FF00] focus:ring-2 focus:ring-[#A8FF00]/20 outline-none transition-all duration-300"
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
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-light-text dark:text-white rounded-xl focus:border-[#A8FF00] focus:ring-2 focus:ring-[#A8FF00]/20 outline-none transition-all duration-300"
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
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-light-text dark:text-white rounded-xl focus:border-[#A8FF00] focus:ring-2 focus:ring-[#A8FF00]/20 outline-none transition-all duration-300"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Matches Section */}
          <div className="lg:col-span-2">
            <div ref={matchesRef} className="mb-8 animate-in fade-in slide-in-from-left duration-1000">
              <h2 className="text-2xl font-bold text-light-text dark:text-white mb-6 flex items-center gap-3">
                <div className="bg-[#A259FF] p-2 rounded-lg">
                  <Trophy size={24} className="text-white" />
                </div>
                Trận đấu khả dụng ({filteredMatches.length})
              </h2>

              <div className="space-y-6">
                {filteredMatches.map((match, index) => {
                  const SkillIcon = getSkillIcon(match.skillLevel);
                  return (
                    <Card 
                      key={match.id} 
                      hover 
                      glow 
                      className={`p-6 cursor-pointer animate-in fade-in slide-in-from-left duration-1000`}
                      style={{ animationDelay: `${index * 150}ms` }}
                      onClick={() => setSelectedMatch(match)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-light-text dark:text-white mb-2">{match.title}</h3>
                          <div className="grid grid-cols-2 gap-4 text-sm text-light-text-secondary dark:text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} />
                              <span>{new Date(match.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={16} />
                              <span>{match.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={16} />
                              <span>{match.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users size={16} />
                              <span>{match.currentPlayers}/22 cầu thủ</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium mb-2 ${getSkillColor(match.skillLevel)}`}>
                            <SkillIcon size={16} />
                            {match.skillLevel}
                          </div>
                          <div className="text-lg font-bold text-[#A8FF00]">
                            {formatPrice(match.price)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={match.organizer.avatar}
                            alt={match.organizer.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-semibold text-light-text dark:text-white">{match.organizer.name}</div>
                            <div className="flex items-center gap-1 text-sm text-light-text-secondary dark:text-gray-600">
                              <Star size={14} className="text-yellow-400" fill="currentColor" />
                              <span className="text-yellow-600 dark:text-yellow-400">{match.organizer.rating} điểm</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            match.playersNeeded === 0 
                              ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' 
                              : 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                          }`}>
                            {match.playersNeeded === 0 ? 'Đã đủ' : `${match.playersNeeded} chỗ trống`}
                          </div>
                          <Button 
                            size="sm" 
                            disabled={match.playersNeeded === 0}
                            className="bg-[#A8FF00] text-black hover:bg-[#96E600]"
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
          </div>

          {/* Players Section */}
          <div className="lg:col-span-1">
            <div ref={playersRef} className="animate-in fade-in slide-in-from-right duration-1000">
              <h2 className="text-2xl font-bold text-light-text dark:text-white mb-6 flex items-center gap-3">
                <div className="bg-[#A8FF00] p-2 rounded-lg">
                  <UserPlus size={24} className="text-black" />
                </div>
                Cầu thủ nổi bật
              </h2>

              <div className="space-y-4">
                {filteredPlayers.slice(0, 6).map((player, index) => {
                  const SkillIcon = getSkillIcon(player.skillLevel);
                  return (
                    <Card 
                      key={player.id} 
                      hover 
                      className={`p-4 cursor-pointer animate-in fade-in slide-in-from-right duration-1000`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => setShowPlayerProfile(player)}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={player.avatar}
                          alt={player.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-light-text dark:text-white">{player.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-gray-600">
                            <MapPin size={12} />
                            <span>{player.location.split(',')[0]}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-medium mb-1 ${getSkillColor(player.skillLevel)}`}>
                            <SkillIcon size={12} />
                            {player.skillLevel}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star size={12} className="text-yellow-400" fill="currentColor" />
                            <span className="text-yellow-600 dark:text-yellow-400">{player.rating}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Community CTA */}
        <section ref={communityRef} className="mt-16 animate-in fade-in slide-in-from-bottom duration-1000">
          <Card className="relative p-12 bg-gradient-to-br from-[#A8FF00] to-[#96E600] text-black overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')] bg-cover bg-center opacity-10" />
            <div className="relative text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-black/10 p-4 rounded-full">
                  <Globe size={48} className="text-black" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tham gia cộng đồng cầu thủ Xnova
              </h2>
              <p className="text-xl mb-8 opacity-80 max-w-2xl mx-auto">
                Kết nối với hơn 10.000+ người yêu bóng đá, tổ chức trận đấu và nâng tầm kỹ năng của bạn.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" glow>
                  <TrendingUp className="mr-2" size={20} />
                  Tham gia cộng đồng
                </Button>
                <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                  <Award className="mr-2" size={20} />
                  Tạo trận đấu
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </div>

      {/* Match Details Modal */}
      <Modal 
        isOpen={!!selectedMatch} 
        onClose={() => setSelectedMatch(null)}
        size="lg"
      >
        {selectedMatch && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-light-text dark:text-white mb-2">{selectedMatch.title}</h2>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium ${getSkillColor(selectedMatch.skillLevel)}`}>
                {React.createElement(getSkillIcon(selectedMatch.skillLevel), { size: 20 })}
                {selectedMatch.skillLevel.charAt(0).toUpperCase() + selectedMatch.skillLevel.slice(1)} Trình độ
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-[#A8FF00]" size={20} />
                  <div>
                    <div className="font-semibold text-light-text dark:text-white">Ngày</div>
                    <div className="text-light-text-secondary dark:text-gray-600">{new Date(selectedMatch.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-[#A8FF00]" size={20} />
                  <div>
                    <div className="font-semibold text-light-text dark:text-white">Giờ</div>
                    <div className="text-light-text-secondary dark:text-gray-600">{selectedMatch.time}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="text-[#A8FF00]" size={20} />
                  <div>
                    <div className="font-semibold text-light-text dark:text-white">Khu vực</div>
                    <div className="text-light-text-secondary dark:text-gray-600">{selectedMatch.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="text-[#A8FF00]" size={20} />
                  <div>
                    <div className="font-semibold text-light-text dark:text-white">Cầu thủ</div>
                    <div className="text-light-text-secondary dark:text-gray-600">{selectedMatch.currentPlayers}/22</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
              <h3 className="font-bold mb-3 text-light-text dark:text-white">Người tổ chức</h3>
              <div className="flex items-center gap-3">
                <img
                  src={selectedMatch.organizer.avatar}
                  alt={selectedMatch.organizer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold text-light-text dark:text-white">{selectedMatch.organizer.name}</div>
                  <div className="flex items-center gap-1 text-sm text-light-text-secondary dark:text-gray-600">
                    <Star size={14} className="text-yellow-400" fill="currentColor" />
                    <span className="text-yellow-600 dark:text-yellow-400">{selectedMatch.organizer.rating} điểm</span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <MessageCircle size={16} className="mr-1" />
                  Nhắn tin
                </Button>
              </div>
            </div>

            <div className="bg-[#A8FF00]/10 p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-light-text dark:text-white">Phí tham gia:</span>
                <span className="text-2xl font-bold text-[#A8FF00]">{formatPrice(selectedMatch.price)}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                className="flex-1" 
                size="lg" 
                glow
                disabled={selectedMatch.playersNeeded === 0}
              >
                {selectedMatch.playersNeeded === 0 ? 'Đã đủ' : 'Tham gia trận đấu'}
              </Button>
              <Button variant="outline" size="lg">
                <MessageCircle size={20} />
                Nhắn tin
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Player Profile Modal */}
      <Modal 
        isOpen={!!showPlayerProfile} 
        onClose={() => setShowPlayerProfile(null)}
        size="md"
      >
        {showPlayerProfile && (
          <div className="space-y-6">
            <div className="text-center">
              <img
                src={showPlayerProfile.avatar}
                alt={showPlayerProfile.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-light-text dark:text-white mb-2">{showPlayerProfile.name}</h2>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium ${getSkillColor(showPlayerProfile.skillLevel)}`}>
                {React.createElement(getSkillIcon(showPlayerProfile.skillLevel), { size: 20 })}
                {showPlayerProfile.skillLevel.charAt(0).toUpperCase() + showPlayerProfile.skillLevel.slice(1)} Cầu thủ
              </div>
            </div>

            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center mb-1">
                  <Star className="text-yellow-400" size={20} fill="currentColor" />
                  <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{showPlayerProfile.rating}</span>
                </div>
                <div className="text-sm text-light-text-secondary dark:text-gray-600">Đánh giá</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center mb-1">
                  <MapPin className="text-[#A8FF00]" size={20} />
                </div>
                <div className="text-sm text-light-text-secondary dark:text-gray-600">{showPlayerProfile.location}</div>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
              <h3 className="font-bold mb-2 text-light-text dark:text-white">Giới thiệu</h3>
              <p className="text-light-text-secondary dark:text-gray-600">{showPlayerProfile.bio}</p>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1" size="lg" glow>
                <UserPlus size={20} className="mr-2" />
                Mời tham gia trận
              </Button>
              <Button variant="outline" size="lg">
                <MessageCircle size={20} />
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};