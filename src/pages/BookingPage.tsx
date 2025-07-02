import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, Star, Filter, CreditCard } from 'lucide-react';

const BookingPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);

  const locations = [
    'Trung tâm', 'Khu Bắc', 'Khu Tây', 'Quận Đông', 'Công viên Nam'
  ];

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  const fields = [
    {
      id: '1',
      name: 'Sân vận động cao cấp',
      location: 'Trung tâm',
      rating: 4.9,
      price: 75,
      image: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=400',
      features: ['Cỏ chuyên nghiệp', 'Đèn chiếu sáng', 'Phòng thay đồ', 'Bãi đậu xe'],
      available: true
    },
    {
      id: '2',
      name: 'Trung tâm huấn luyện Elite',
      location: 'Khu Bắc',
      rating: 4.8,
      price: 65,
      image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=400',
      features: ['Cỏ nhân tạo', 'Có mái che', 'Thuê dụng cụ', 'Huấn luyện viên'],
      available: true
    },
    {
      id: '3',
      name: 'Khu thể thao cộng đồng',
      location: 'Khu Tây',
      rating: 4.7,
      price: 45,
      image: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=400',
      features: ['Nhiều sân', 'Căn tin', 'Khu ngồi xem', 'Thân thiện trẻ em'],
      available: false
    },
    {
      id: '4',
      name: 'Sân vận động chuyên nghiệp',
      location: 'Quận Đông',
      rating: 5.0,
      price: 95,
      image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400',
      features: ['Chuẩn giải đấu', 'Phòng VIP', 'Truyền hình trực tiếp', 'Hỗ trợ y tế'],
      available: true
    }
  ];

  const filteredFields = selectedLocation 
    ? fields.filter(field => field.location === selectedLocation)
    : fields;

  const handleBooking = () => {
    setShowBookingModal(true);
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-light-text dark:text-white mb-4">
            Đặt <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-lime-400">Sân Lý Tưởng</span>
          </h1>
          <p className="text-xl text-light-text-secondary dark:text-gray-300">
            Lựa chọn các sân bóng đá chất lượng trên toàn thành phố
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-light-card to-gray-100 dark:from-card-bg dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 sticky top-24 transition-colors duration-300">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-neon-green" />
                <h3 className="text-lg font-semibold text-light-text dark:text-white">Bộ lọc</h3>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-light-text-secondary dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Khu vực
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-light-text dark:text-white focus:border-neon-green focus:outline-none transition-colors duration-300"
                >
                  <option value="">Tất cả khu vực</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Date Picker */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-light-text-secondary dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Ngày
                </label>
                <input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-light-text dark:text-white focus:border-neon-green focus:outline-none transition-colors duration-300"
                />
              </div>

              {/* Time Slots */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-light-text-secondary dark:text-gray-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Giờ
                </label>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-2 py-1 text-xs rounded-lg transition-colors duration-200 ${
                        selectedTime === time
                          ? 'bg-neon-green text-dark-bg'
                          : 'bg-gray-200 dark:bg-gray-700 text-light-text-secondary dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fields Grid */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-6">
              {filteredFields.map(field => (
                <div
                  key={field.id}
                  className={`bg-gradient-to-br from-light-card to-gray-100 dark:from-card-bg dark:to-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-neon-green/50 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    !field.available ? 'opacity-60' : ''
                  }`}
                >
                  <div className="relative">
                    <img
                      src={field.image}
                      alt={field.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm font-medium">{field.rating}</span>
                    </div>
                    {!field.available && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                          Không khả dụng
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-light-text dark:text-white mb-1">{field.name}</h3>
                        <div className="flex items-center text-light-text-secondary dark:text-gray-300 text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {field.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-neon-green">{field.price}₫</div>
                        <div className="text-light-text-secondary dark:text-gray-400 text-sm">mỗi giờ</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {field.features.map(feature => (
                        <span
                          key={feature}
                          className="bg-gray-200/50 dark:bg-gray-700/50 text-light-text-secondary dark:text-gray-300 text-xs px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedField(field.id);
                        handleBooking();
                      }}
                      disabled={!field.available}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                        field.available
                          ? 'bg-gradient-to-r from-neon-green to-lime-400 text-dark-bg hover:from-lime-400 hover:to-neon-green hover:shadow-lg hover:shadow-neon-green/25'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {field.available ? 'Đặt ngay' : 'Không khả dụng'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-light-card to-gray-100 dark:from-card-bg dark:to-gray-800 rounded-3xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-700 animate-slide-up transition-colors duration-300">
            <h3 className="text-2xl font-bold text-light-text dark:text-white mb-6 text-center">
              Xác nhận đặt sân
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-gray-300 dark:border-gray-700">
                <span className="text-light-text-secondary dark:text-gray-300">Sân:</span>
                <span className="text-light-text dark:text-white font-medium">Sân vận động cao cấp</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-300 dark:border-gray-700">
                <span className="text-light-text-secondary dark:text-gray-300">Ngày:</span>
                <span className="text-light-text dark:text-white font-medium">{selectedDate.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-300 dark:border-gray-700">
                <span className="text-light-text-secondary dark:text-gray-300">Giờ:</span>
                <span className="text-light-text dark:text-white font-medium">{selectedTime || '18:00'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-300 dark:border-gray-700">
                <span className="text-light-text-secondary dark:text-gray-300">Thời lượng:</span>
                <span className="text-light-text dark:text-white font-medium">2 giờ</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-light-text-secondary dark:text-gray-300">Tổng cộng:</span>
                <span className="text-2xl font-bold text-neon-green">{selectedField ? (fields.find(f => f.id === selectedField)?.price ?? 0) * 2 : 0}₫</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-light-text-secondary dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                Hủy
              </button>
              <button className="flex-1 bg-gradient-to-r from-neon-green to-lime-400 text-dark-bg py-3 rounded-xl font-semibold hover:from-lime-400 hover:to-neon-green transition-all duration-300 flex items-center justify-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Thanh toán</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;