import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/AuthContext/AuthContext';
import { bookingService } from '../../../services/api';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign,
  Trophy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import './CreateMatchModal.css';

export const CreateMatchModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [step, setStep] = useState('choice'); // 'choice', 'without-booking', 'with-booking'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userBookings, setUserBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    startTime: '',
    endTime: '',
    totalPlayer: '',
    availablePlayer: '',
    joiningCost: '',
    standard: '',
    kindOfSport: 'Bóng đá',
    location: '',
    longitude: '',
    latitude: '',
    bookingId: null,
    booked: 0
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('choice');
      setFormData({
        name: '',
        date: '',
        startTime: '',
        endTime: '',
        totalPlayer: '',
        availablePlayer: '',
        joiningCost: '',
        standard: '',
        kindOfSport: 'Bóng đá',
        location: '',
        longitude: '',
        latitude: '',
        bookingId: null,
        booked: 0
      });
      setError('');
      setUserBookings([]);
    }
  }, [isOpen]);

  // Fetch user bookings when choosing "with booking"
  const fetchUserBookings = async () => {
    if (!user?.userId) return;
    
    setLoadingBookings(true);
    try {
      const bookings = await bookingService.getBookingsByUserId(user.userId);
      // Filter for active/upcoming bookings
      const activeBookings = bookings.filter(b => 
        new Date(b.date) >= new Date() && b.status === 'confirmed'
      );
      setUserBookings(activeBookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Không thể tải danh sách booking của bạn');
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleBookingSelect = (booking) => {
    setFormData(prev => ({
      ...prev,
      bookingId: booking.bookingId,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      location: booking.fieldLocation || booking.location,
      booked: 1
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên trận đấu');
      return false;
    }
    if (!formData.date) {
      setError('Vui lòng chọn ngày');
      return false;
    }
    if (!formData.startTime) {
      setError('Vui lòng chọn giờ bắt đầu');
      return false;
    }
    if (!formData.endTime) {
      setError('Vui lòng chọn giờ kết thúc');
      return false;
    }
    if (!formData.totalPlayer || formData.totalPlayer <= 0) {
      setError('Vui lòng nhập số lượng cầu thủ');
      return false;
    }
    if (!formData.availablePlayer || formData.availablePlayer <= 0) {
      setError('Vui lòng nhập số lượng cầu thủ cần tìm');
      return false;
    }
    if (parseInt(formData.availablePlayer) > parseInt(formData.totalPlayer)) {
      setError('Số cầu thủ cần tìm không thể lớn hơn tổng số cầu thủ');
      return false;
    }
    if (step === 'without-booking' && !formData.location.trim()) {
      setError('Vui lòng nhập địa điểm');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!user?.userId) {
      setError('Bạn cần đăng nhập để tạo trận đấu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const invitationData = {
        name: formData.name,
        booked: formData.booked,
        joiningCost: parseFloat(formData.joiningCost) || 0,
        totalPlayer: parseInt(formData.totalPlayer),
        availablePlayer: parseInt(formData.availablePlayer),
        standard: formData.standard || '',
        kindOfSport: formData.kindOfSport,
        location: formData.location,
        longitude: formData.longitude || '',
        latitude: formData.latitude || '',
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        postingDate: new Date().toISOString(),
        status: 0,
        userId: user.userId,
        bookingId: formData.bookingId || 0
      };

      // Call API to create invitation
      const response = await bookingService.createInvitation(invitationData);
      
      if (onSuccess) {
        onSuccess(response);
      }
      onClose();
    } catch (err) {
      console.error('Error creating match:', err);
      setError(err.message || 'Có lỗi xảy ra khi tạo trận đấu');
    } finally {
      setLoading(false);
    }
  };

  const renderChoiceStep = () => (
    <div className="create-match-modal__choice">
      <h2 className="create-match-modal__title">Tạo Trận Đấu Mới</h2>
      <p className="create-match-modal__subtitle">Chọn cách tạo trận đấu của bạn</p>
      
      <div className="create-match-modal__options">
        <div 
          className="create-match-modal__option"
          onClick={() => setStep('without-booking')}
        >
          <div className="create-match-modal__option-icon">
            <MapPin size={32} />
          </div>
          <h3>Chưa có sân</h3>
          <p>Tạo trận đấu với thông tin đầy đủ về địa điểm, thời gian và chi tiết khác</p>
          <Button className="create-match-modal__option-btn">
            Chọn
          </Button>
        </div>

        <div 
          className="create-match-modal__option"
          onClick={() => {
            setStep('with-booking');
            fetchUserBookings();
          }}
        >
          <div className="create-match-modal__option-icon">
            <CheckCircle size={32} />
          </div>
          <h3>Đã có sân</h3>
          <p>Chọn từ các booking của bạn và điền thông tin còn thiếu</p>
          <Button className="create-match-modal__option-btn">
            Chọn
          </Button>
        </div>
      </div>
    </div>
  );

  const renderWithoutBookingForm = () => (
    <div className="create-match-modal__form-container">
      <div className="create-match-modal__header">
        <h2 className="create-match-modal__title">Tạo Trận Đấu - Chưa có sân</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setStep('choice')}
        >
          Quay lại
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="create-match-modal__form">
        {error && (
          <div className="create-match-modal__error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="create-match-modal__field">
          <label>
            <Trophy size={16} />
            Tên trận đấu *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="VD: Giao hữu cuối tuần"
            required
          />
        </div>

        <div className="create-match-modal__field-row">
          <div className="create-match-modal__field">
            <label>
              <Calendar size={16} />
              Ngày *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="create-match-modal__field">
            <label>
              <Clock size={16} />
              Giờ bắt đầu *
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="create-match-modal__field">
            <label>
              <Clock size={16} />
              Giờ kết thúc *
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="create-match-modal__field">
          <label>
            <MapPin size={16} />
            Địa điểm *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="VD: Sân bóng ABC, Quận 1, TP.HCM"
            required
          />
        </div>

        <div className="create-match-modal__field-row">
          <div className="create-match-modal__field">
            <label>
              <Users size={16} />
              Tổng số cầu thủ *
            </label>
            <input
              type="number"
              name="totalPlayer"
              value={formData.totalPlayer}
              onChange={handleInputChange}
              placeholder="10"
              min="2"
              required
            />
          </div>

          <div className="create-match-modal__field">
            <label>
              <Users size={16} />
              Số cầu thủ cần tìm *
            </label>
            <input
              type="number"
              name="availablePlayer"
              value={formData.availablePlayer}
              onChange={handleInputChange}
              placeholder="5"
              min="1"
              required
            />
          </div>
        </div>

        <div className="create-match-modal__field">
          <label>
            <DollarSign size={16} />
            Chi phí tham gia (VNĐ)
          </label>
          <input
            type="number"
            name="joiningCost"
            value={formData.joiningCost}
            onChange={handleInputChange}
            placeholder="100000"
            min="0"
          />
        </div>

        <div className="create-match-modal__field-row">
          <div className="create-match-modal__field">
            <label>Trình độ</label>
            <select
              name="standard"
              value={formData.standard}
              onChange={handleInputChange}
            >
              <option value="">Chọn trình độ</option>
              <option value="Mới bắt đầu">Mới bắt đầu</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Nâng cao">Nâng cao</option>
              <option value="Chuyên nghiệp">Chuyên nghiệp</option>
            </select>
          </div>

          <div className="create-match-modal__field">
            <label>Loại thể thao</label>
            <select
              name="kindOfSport"
              value={formData.kindOfSport}
              onChange={handleInputChange}
            >
              <option value="Bóng đá">Bóng đá</option>
              <option value="Bóng rổ">Bóng rổ</option>
              <option value="Cầu lông">Cầu lông</option>
              <option value="Tennis">Tennis</option>
            </select>
          </div>
        </div>

        <div className="create-match-modal__actions">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button 
            type="submit" 
            glow
            disabled={loading}
          >
            {loading ? 'Đang tạo...' : 'Tạo trận đấu'}
          </Button>
        </div>
      </form>
    </div>
  );

  const renderWithBookingForm = () => (
    <div className="create-match-modal__form-container">
      <div className="create-match-modal__header">
        <h2 className="create-match-modal__title">Tạo Trận Đấu - Đã có sân</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setStep('choice')}
        >
          Quay lại
        </Button>
      </div>

      {!formData.bookingId ? (
        <div className="create-match-modal__bookings">
          <h3>Chọn booking của bạn</h3>
          {loadingBookings ? (
            <div className="create-match-modal__loading">Đang tải...</div>
          ) : userBookings.length === 0 ? (
            <div className="create-match-modal__empty">
              <AlertCircle size={32} />
              <p>Bạn chưa có booking nào</p>
              <Button onClick={onClose}>Đóng</Button>
            </div>
          ) : (
            <div className="create-match-modal__booking-list">
              {userBookings.map(booking => (
                <div 
                  key={booking.bookingId}
                  className="create-match-modal__booking-item"
                  onClick={() => handleBookingSelect(booking)}
                >
                  <div className="create-match-modal__booking-info">
                    <h4>{booking.fieldName || 'Sân bóng'}</h4>
                    <div className="create-match-modal__booking-details">
                      <span><Calendar size={14} /> {new Date(booking.date).toLocaleDateString('vi-VN')}</span>
                      <span><Clock size={14} /> {booking.startTime} - {booking.endTime}</span>
                      <span><MapPin size={14} /> {booking.fieldLocation || booking.location}</span>
                    </div>
                  </div>
                  <Button size="sm">Chọn</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="create-match-modal__form">
          {error && (
            <div className="create-match-modal__error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="create-match-modal__booking-selected">
            <CheckCircle size={20} />
            <div>
              <strong>Booking đã chọn</strong>
              <p>{new Date(formData.date).toLocaleDateString('vi-VN')} • {formData.startTime} - {formData.endTime}</p>
              <p>{formData.location}</p>
            </div>
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={() => setFormData(prev => ({ ...prev, bookingId: null }))}
            >
              Đổi
            </Button>
          </div>

          <div className="create-match-modal__field">
            <label>
              <Trophy size={16} />
              Tên trận đấu *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="VD: Giao hữu cuối tuần"
              required
            />
          </div>

          <div className="create-match-modal__field-row">
            <div className="create-match-modal__field">
              <label>
                <Users size={16} />
                Tổng số cầu thủ *
              </label>
              <input
                type="number"
                name="totalPlayer"
                value={formData.totalPlayer}
                onChange={handleInputChange}
                placeholder="10"
                min="2"
                required
              />
            </div>

            <div className="create-match-modal__field">
              <label>
                <Users size={16} />
                Số cầu thủ cần tìm *
              </label>
              <input
                type="number"
                name="availablePlayer"
                value={formData.availablePlayer}
                onChange={handleInputChange}
                placeholder="5"
                min="1"
                required
              />
            </div>
          </div>

          <div className="create-match-modal__field">
            <label>
              <DollarSign size={16} />
              Chi phí tham gia (VNĐ)
            </label>
            <input
              type="number"
              name="joiningCost"
              value={formData.joiningCost}
              onChange={handleInputChange}
              placeholder="100000"
              min="0"
            />
          </div>

          <div className="create-match-modal__field-row">
            <div className="create-match-modal__field">
              <label>Trình độ</label>
              <select
                name="standard"
                value={formData.standard}
                onChange={handleInputChange}
              >
                <option value="">Chọn trình độ</option>
                <option value="Mới bắt đầu">Mới bắt đầu</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Nâng cao">Nâng cao</option>
                <option value="Chuyên nghiệp">Chuyên nghiệp</option>
              </select>
            </div>

            <div className="create-match-modal__field">
              <label>Loại thể thao</label>
              <select
                name="kindOfSport"
                value={formData.kindOfSport}
                onChange={handleInputChange}
              >
                <option value="Bóng đá">Bóng đá</option>
                <option value="Bóng rổ">Bóng rổ</option>
                <option value="Cầu lông">Cầu lông</option>
                <option value="Tennis">Tennis</option>
              </select>
            </div>
          </div>

          <div className="create-match-modal__actions">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              glow
              disabled={loading}
            >
              {loading ? 'Đang tạo...' : 'Tạo trận đấu'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      {step === 'choice' && renderChoiceStep()}
      {step === 'without-booking' && renderWithoutBookingForm()}
      {step === 'with-booking' && renderWithBookingForm()}
    </Modal>
  );
};
