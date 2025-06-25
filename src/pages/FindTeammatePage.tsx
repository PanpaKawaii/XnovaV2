import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Clock, 
  Star, 
  Filter, 
  MessageCircle, 
  UserPlus,
  Trophy,
  Calendar,
  Shield
} from 'lucide-react';

const FindTeammatePage: React.FC = () => {
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
  const locations = ['Downtown', 'North Side', 'West End', 'East District', 'South Park'];
  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];

  const matches = [
    {
      id: '1',
      title: 'Casual 5v5 Match',
      organizer: 'Alex Rodriguez',
      organizerAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      skillLevel: 'Intermediate',
      location: 'Downtown',
      time: '18:00',
      date: '2024-01-15',
      playersNeeded: 3,
      totalPlayers: 10,
      price: 15,
      description: 'Looking for skilled players for a fun evening match. Great opportunity to improve your game!',
      verified: true
    },
    {
      id: '2',
      title: 'Weekend Tournament Prep',
      organizer: 'Sarah Johnson',
      organizerAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      skillLevel: 'Advanced',
      location: 'North Side',
      time: '16:00',
      date: '2024-01-16',
      playersNeeded: 2,
      totalPlayers: 11,
      price: 25,
      description: 'Preparing for upcoming tournament. Serious players only. High-intensity training session.',
      verified: true
    },
    {
      id: '3',
      title: 'Beginner Friendly Match',
      organizer: 'Miguel Santos',
      organizerAvatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      skillLevel: 'Beginner',
      location: 'West End',
      time: '10:00',
      date: '2024-01-17',
      playersNeeded: 5,
      totalPlayers: 22,
      price: 10,
      description: 'Perfect for new players! Focus on fun and learning. Experienced players welcome to mentor.',
      verified: false
    },
    {
      id: '4',
      title: 'Professional Training',
      organizer: 'Emma Wilson',
      organizerAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      skillLevel: 'Professional',
      location: 'East District',
      time: '14:00',
      date: '2024-01-18',
      playersNeeded: 1,
      totalPlayers: 16,
      price: 40,
      description: 'Elite level training session with professional coach. Tryouts for semi-pro league.',
      verified: true
    },
    {
      id: '5',
      title: 'Mixed Skill Scrimmage',
      organizer: 'David Kim',
      organizerAvatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      skillLevel: 'Intermediate',
      location: 'South Park',
      time: '19:00',
      date: '2024-01-19',
      playersNeeded: 4,
      totalPlayers: 18,
      price: 12,
      description: 'Relaxed atmosphere, all skill levels welcome. Focus on teamwork and having fun together.',
      verified: true
    }
  ];

  const players = [
    {
      id: '1',
      name: 'Carlos Martinez',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      skillLevel: 'Advanced',
      position: 'Midfielder',
      rating: 4.8,
      location: 'Downtown',
      gamesPlayed: 127,
      availability: 'Evenings'
    },
    {
      id: '2',
      name: 'Jessica Brown',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      skillLevel: 'Intermediate',
      position: 'Forward',
      rating: 4.6,
      location: 'North Side',
      gamesPlayed: 89,
      availability: 'Weekends'
    },
    {
      id: '3',
      name: 'Ahmed Hassan',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      skillLevel: 'Professional',
      position: 'Goalkeeper',
      rating: 4.9,
      location: 'East District',
      gamesPlayed: 203,
      availability: 'Flexible'
    }
  ];

  const filteredMatches = matches.filter(match => {
    return (!selectedSkillLevel || match.skillLevel === selectedSkillLevel) &&
           (!selectedLocation || match.location === selectedLocation);
  });

  const getSkillColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Advanced': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Professional': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-light-purple to-pink-400">Perfect Team</span>
          </h1>
          <p className="text-xl text-gray-300">
            Connect with players and join exciting matches across the city
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-card-bg to-gray-800 rounded-2xl p-6 border border-gray-700 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-light-purple" />
                <h3 className="text-lg font-semibold text-white">Filters</h3>
              </div>

              {/* Skill Level Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Trophy className="w-4 h-4 inline mr-2" />
                  Skill Level
                </label>
                <select
                  value={selectedSkillLevel}
                  onChange={(e) => setSelectedSkillLevel(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-light-purple focus:outline-none"
                >
                  <option value="">All Levels</option>
                  {skillLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-light-purple focus:outline-none"
                >
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Time Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-light-purple focus:outline-none"
                >
                  <option value="">Any Time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-800 rounded-xl p-1 mb-8">
              <button className="flex-1 bg-light-purple text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300">
                Open Matches
              </button>
              <button className="flex-1 text-gray-400 py-3 px-6 rounded-lg font-medium hover:text-white transition-colors duration-300">
                Available Players
              </button>
            </div>

            {/* Matches Grid */}
            <div className="space-y-6">
              {filteredMatches.map(match => (
                <div
                  key={match.id}
                  className="bg-gradient-to-br from-card-bg to-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-light-purple/50 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={match.organizerAvatar}
                          alt={match.organizer}
                          className="w-12 h-12 rounded-full border-2 border-light-purple/30"
                        />
                        {match.verified && (
                          <div className="absolute -top-1 -right-1 bg-neon-green rounded-full p-1">
                            <Shield className="w-3 h-3 text-dark-bg" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{match.title}</h3>
                        <p className="text-gray-300 text-sm">by {match.organizer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-light-purple">${match.price}</div>
                      <div className="text-gray-400 text-sm">per player</div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">{match.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-gray-400" />
                      <span className={`text-xs px-2 py-1 rounded-full border ${getSkillColor(match.skillLevel)}`}>
                        {match.skillLevel}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{match.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{match.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{match.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-light-purple" />
                        <span className="text-white font-medium">
                          {match.playersNeeded} spots left
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {match.totalPlayers - match.playersNeeded}/{match.totalPlayers} players
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button className="flex items-center space-x-2 text-gray-300 hover:text-light-purple transition-colors duration-300">
                        <MessageCircle className="w-5 h-5" />
                        <span>Message</span>
                      </button>
                      <button className="flex items-center space-x-2 bg-gradient-to-r from-light-purple to-pink-400 text-white px-6 py-2 rounded-xl hover:from-pink-400 hover:to-light-purple transition-all duration-300 hover:shadow-lg hover:shadow-light-purple/25">
                        <UserPlus className="w-4 h-4" />
                        <span>Join Match</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 bg-gray-700/30 rounded-lg p-3">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Match Progress</span>
                      <span>{Math.round(((match.totalPlayers - match.playersNeeded) / match.totalPlayers) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-light-purple to-pink-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((match.totalPlayers - match.playersNeeded) / match.totalPlayers) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindTeammatePage;