import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, MapPin, Calendar, Clock, Users, CreditCard, Check, Plus, Minus, Target, Settings } from 'lucide-react';
import { fetchData } from '../../../mocks/CallingAPI.js';
import { useAuth } from '../../hooks/AuthContext/AuthContext';
import './BookingSummaryModal.css';

const BookingSummaryModal = ({ 
  isOpen, 
  onClose, 
  venue,
  preSelectedDate,
  preSelectedTimeSlot 
}) => {
  const { user } = useAuth();
  
  // Helper function to format time from 00:00:00 to 00:00
  const formatTime = (timeString) => {
    if (!timeString) return '';
    if (timeString.includes(':')) {
      const parts = timeString.split(':');
      if (parts.length >= 2) {
        return `${parts[0]}:${parts[1]}`;
      }
    }
    return timeString;
  };

  // Helper function to format time range
  const formatTimeRange = (timeRange) => {
    if (!timeRange || !timeRange.includes('-')) return timeRange;
    
    const [startTime, endTime] = timeRange.split('-');
    const formattedStart = formatTime(startTime);
    const formattedEnd = formatTime(endTime);
    
    return `${formattedStart}-${formattedEnd}`;
  };

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedField, setSelectedField] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showBookingSummary, setShowBookingSummary] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [bookingId, setBookingId] = useState('');
  
  // API data states
  const [venueFields, setVenueFields] = useState([]);
  const [venueSlots, setVenueSlots] = useState([]);
  const [bookingSlots, setBookingSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refs for auto-scrolling
  const stepRefs = useRef({});
  const modalContentRef = useRef(null);

  // Auto-populate with pre-selected values
  useEffect(() => {
    if (preSelectedDate) {
      setSelectedDate(preSelectedDate);
    }
    if (preSelectedTimeSlot && preSelectedTimeSlot !== 'Mọi khung giờ') {
      // Handle time slot selection
      setSelectedTimes([preSelectedTimeSlot]);
    }
  }, [preSelectedDate, preSelectedTimeSlot]);

  // Fetch venue data when modal opens
  useEffect(() => {
    const fetchVenueData = async () => {
      if (!isOpen || !venue?.id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const token = user?.token || null;

        const fieldsResponse = await fetchData('Field', token);
        const fields = Array.isArray(fieldsResponse) ? fieldsResponse : [fieldsResponse];
        const venueFieldsData = fields.filter(field => field.venueId === venue.id);

        const slotsResponse = await fetchData('Slot', token);
        const slots = Array.isArray(slotsResponse) ? slotsResponse : [slotsResponse];
        const venueSlotsData = slots.filter(slot => 
          venueFieldsData.some(field => field.id === slot.fieldId) && slot.status === 1
        );

        const bookingsResponse = await fetchData('Booking', token);
        const bookingsData = Array.isArray(bookingsResponse) ? bookingsResponse : [bookingsResponse];
        
        const bookingSlotsResponse = await fetchData('BookingSlot', token);
        const bookingSlotsData = Array.isArray(bookingSlotsResponse) ? bookingSlotsResponse : [bookingSlotsResponse];

        setVenueFields(venueFieldsData);
        setVenueSlots(venueSlotsData);
        setBookings(bookingsData);
        setBookingSlots(bookingSlotsData);
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching venue data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenueData();
  }, [isOpen, venue?.id, user?.token]);

  // Show booking summary when all steps are completed
  useEffect(() => {
    if (paymentMethod && selectedDate && selectedTimes.length > 0) {
      setShowBookingSummary(true);
    } else {
      setShowBookingSummary(false);
    }
  }, [paymentMethod, selectedDate, selectedTimes]);

  // Get available time slots for selected date using API data
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate || venueSlots.length === 0) return [];
    
    const timeSlotMap = new Map();
    
    venueSlots.forEach(slot => {
      const timeKey = `${slot.startTime}-${slot.endTime}`;
      const displayTimeKey = formatTimeRange(timeKey);
      
      const isBooked = bookingSlots.some(bs => 
        bs.slotId === slot.id && 
        bookings.some(b => 
          b.id === bs.bookingId && 
          b.date === selectedDate && 
          b.status === 1
        )
      );
      
      if (!timeSlotMap.has(timeKey)) {
        timeSlotMap.set(timeKey, {
          time: timeKey,
          displayTime: displayTimeKey,
          startTime: formatTime(slot.startTime),
          endTime: formatTime(slot.endTime),
          price: slot.price,
          isAvailable: !isBooked,
          slots: [slot]
        });
      } else {
        const existing = timeSlotMap.get(timeKey);
        existing.slots.push(slot);
        if (!isBooked) {
          existing.isAvailable = true;
        }
      }
    });
    
    const availableSlots = Array.from(timeSlotMap.values())
      .filter(slot => slot.isAvailable)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    return availableSlots;
  }, [selectedDate, venueSlots, bookingSlots, bookings]);

  // Get available fields for selected time slot using API data
  const availableFields = useMemo(() => {
    if (!selectedTimes.length || venueFields.length === 0) return [];
    
    const selectedTimeSlots = availableTimeSlots.filter(slot => selectedTimes.includes(slot.time));
    if (selectedTimeSlots.length === 0) return [];
    
    const availableFieldsData = venueFields.filter(field => {
      return selectedTimeSlots.some(slot => 
        slot.slots.some(s => s.fieldId === field.id)
      );
    });
    
    return availableFieldsData.map(field => ({
      id: field.id,
      name: field.name,
      type: field.type || 'Standard',
      description: field.description || ''
    }));
  }, [selectedTimes, selectedDate, venueFields, availableTimeSlots, bookingSlots, bookings]);

  // Auto-select first available field when times are selected
  useEffect(() => {
    if (selectedTimes.length > 0 && availableFields.length > 0 && !selectedField) {
      setSelectedField(availableFields[0].id);
    }
  }, [selectedTimes, availableFields, selectedField]);

  // Get consecutive time slots for extended booking
  const getConsecutiveTimeSlots = (startTime, duration) => {
    const startIndex = availableTimeSlots.findIndex(slot => slot.time === startTime);
    if (startIndex === -1) return [];
    
    const consecutiveSlots = [];
    for (let i = 0; i < duration; i++) {
      const slotIndex = startIndex + i;
      if (slotIndex < availableTimeSlots.length) {
        consecutiveSlots.push(availableTimeSlots[slotIndex]);
      }
    }
    return consecutiveSlots;
  };

  // Check if consecutive time slots are available
  const isConsecutiveTimeAvailable = (startTime, duration) => {
    const consecutiveSlots = getConsecutiveTimeSlots(startTime, duration);
    return consecutiveSlots.length === duration;
  };

  // Helper functions and calculations
  const calculateTotalPrice = () => {
    const basePrice = availableTimeSlots.find(slot => slot.time === selectedTimes[0])?.price || venue?.basePrice || 0;
    return basePrice * selectedTimes.length;
  };

  const totalPrice = calculateTotalPrice();

  // Handle time change
  const handleTimeChange = (time) => {
    setSelectedTimes(prev => {
      if (prev.includes(time)) {
        return prev.filter(t => t !== time);
      } else {
        return [...prev, time];
      }
    });
    setPaymentMethod('');
  };

  // Auto-scroll to payment step when modal opens with preSelectedTimeSlot
  useEffect(() => {
    if (isOpen && preSelectedTimeSlot && selectedTimes.length > 0) {
      setTimeout(() => {
        const paymentStepElement = stepRefs.current[3];
        if (paymentStepElement && modalContentRef.current) {
          paymentStepElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 300);
    }
  }, [isOpen, preSelectedTimeSlot, selectedTimes]);

  // Auto-scroll to next step when current step is completed
  useEffect(() => {
    if (!isOpen) return;

    const scrollToNextStep = (stepNumber) => {
      setTimeout(() => {
        const nextStepElement = stepRefs.current[stepNumber];
        if (nextStepElement && modalContentRef.current) {
          nextStepElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 500);
    };

    if (selectedDate && selectedTimes.length === 0) {
      scrollToNextStep(2);
    }
    else if (selectedTimes.length > 0 && !paymentMethod) {
      scrollToNextStep(3);
    }
    else if (paymentMethod && showBookingSummary) {
      scrollToNextStep(4);
    }
  }, [isOpen, selectedDate, selectedTimes, paymentMethod, showBookingSummary]);

  // Steps definition
  const steps = [
    { 
      id: 1, 
      title: 'Chọn ngày', 
      icon: Calendar, 
      completed: !!selectedDate 
    },
    { 
      id: 2, 
      title: 'Chọn giờ', 
      icon: Clock, 
      completed: selectedTimes.length > 0 
    },
    { 
      id: 3, 
      title: 'Thanh toán', 
      icon: CreditCard, 
      completed: !!paymentMethod 
    }
  ];

  // Payment methods
  const paymentMethods = [
    { id: 'cash', name: 'Tiền mặt', icon: '💵', description: 'Thanh toán tại sân' },
    { id: 'card', name: 'Thẻ tín dụng', icon: '💳', description: 'Visa, MasterCard' },
    { id: 'momo', name: 'MoMo', icon: '🟣', description: 'Ví điện tử MoMo' },
    { id: 'banking', name: 'Chuyển khoản', icon: '🏦', description: 'Internet Banking' }
  ];

  // Calculate current step based on completed information
  const currentStep = useMemo(() => {
    if (!selectedDate) return 1;
    if (selectedTimes.length === 0) return 2;
    if (!paymentMethod) return 3;
    return 4;
  }, [selectedDate, selectedTimes, paymentMethod]);

  // Generate booking ID
  const generateBookingId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Handle booking confirmation
  const handleConfirmBooking = () => {
    const newBookingId = generateBookingId();
    setBookingId(newBookingId);
    setShowSuccessPopup(true);
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    onClose();
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTimes([]);
    setPaymentMethod('');
  };

  // Handle step navigation
  const handleStepClick = (stepId) => {
    let maxAllowedStep = 1;
    if (selectedDate) maxAllowedStep = 1.5;
    if (selectedTimes.length > 0) maxAllowedStep = 2;
    if (paymentMethod) maxAllowedStep = 3;

    if (stepId <= maxAllowedStep) {
      setTimeout(() => {
        const targetStepElement = stepRefs.current[stepId];
        if (targetStepElement && modalContentRef.current) {
          targetStepElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    } else {
      const stepNames = {
        2: 'chọn khung giờ',
        3: 'chọn phương thức thanh toán',
        4: 'xác nhận đặt sân'
      };
      
      const requiredSteps = {
        2: 'chọn ngày',
        3: 'chọn ngày và khung giờ',
        4: 'hoàn thành tất cả các bước trước'
      };

      setWarningMessage(`Bạn cần ${requiredSteps[stepId]} trước khi ${stepNames[stepId]}!`);
      setShowWarning(true);
      
      setTimeout(() => {
        setShowWarning(false);
      }, 3000);
    }
  };

  // Reset modal state when it closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDate('');
      setSelectedTimes([]);
      setSelectedField('');
      setPaymentMethod('');
      setShowBookingSummary(false);
      setShowWarning(false);
      setWarningMessage('');
      setShowSuccessPopup(false);
      setBookingId('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="booking-summary-modal">
      <div className="booking-summary-modal__content" ref={modalContentRef}>
        {loading && (
          <div className="booking-summary-modal__loading">
            <div className="booking-summary-modal__loading-spinner">⏳</div>
            <p>Đang tải thông tin sân...</p>
          </div>
        )}

        {error && (
          <div className="booking-summary-modal__error">
            <div className="booking-summary-modal__error-icon">❌</div>
            <p>Lỗi: {error}</p>
            <button onClick={() => setError(null)}>Thử lại</button>
          </div>
        )}

        {showWarning && (
          <div className="booking-summary-modal__warning-toast">
            <div className="booking-summary-modal__warning-content">
              <span className="booking-summary-modal__warning-icon">⚠️</span>
              <span className="booking-summary-modal__warning-text">{warningMessage}</span>
            </div>
          </div>
        )}

        <div className="booking-summary-modal__header">
          <h2 className="booking-summary-modal__title">Đặt sân - {venue?.name}</h2>
          <button onClick={onClose} className="booking-summary-modal__close">
            <X size={24} />
          </button>
        </div>

        <div className="booking-summary-modal__venue-quick-info">
          <div className="booking-summary-modal__venue-icon">
            <span>🏟️</span>
          </div>
          <div className="booking-summary-modal__venue-details">
            <h3 className="booking-summary-modal__venue-name">{venue?.name}</h3>
            <div className="booking-summary-modal__venue-location">
              <MapPin size={12} />
              <span>{venue?.location}</span>
            </div>
          </div>
        </div>

        <div className="booking-summary-modal__main">
          <div className="booking-summary-modal__steps">
            <div 
              className={`booking-summary-modal__step ${currentStep >= 1 ? 'active' : 'inactive'}`}
              ref={el => stepRefs.current[1] = el}
            >
              <div className={`booking-summary-modal__step-content ${
                currentStep === 1 ? 'current' : selectedDate ? 'completed' : 'pending'
              }`}>
                <div className="booking-summary-modal__step-header">
                  <div className={`booking-summary-modal__step-number ${selectedDate ? 'completed' : 'current'}`}>
                    {selectedDate ? '✓' : '1'}
                  </div>
                  <div className="booking-summary-modal__step-info">
                    <h3 className="booking-summary-modal__step-title">Chọn ngày chơi</h3>
                    {selectedDate && (
                      <p className="booking-summary-modal__step-selected">
                        {new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </p>
                    )}
                  </div>
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="booking-summary-modal__date-input"
                />
                {currentStep === 1 && (
                  <div className="booking-summary-modal__step-tip">
                    <p>💡 Chọn ngày bạn muốn chơi (tối thiểu từ hôm nay). Kiểm tra lịch của bạn trước khi chọn!</p>
                  </div>
                )}
              </div>
            </div>

            {selectedDate && (
              <div 
                className={`booking-summary-modal__step ${currentStep >= 2 ? 'active' : 'inactive'}`}
                ref={el => stepRefs.current[2] = el}
              >
                <div className={`booking-summary-modal__step-content ${
                  currentStep === 2 ? 'current' : selectedTimes.length > 0 ? 'completed' : 'pending'
                }`}>
                  <div className="booking-summary-modal__step-header">
                    <div className={`booking-summary-modal__step-number ${selectedTimes.length > 0 ? 'completed' : 'current'}`}>
                      {selectedTimes.length > 0 ? '✓' : '2'}
                    </div>
                    <div className="booking-summary-modal__step-info">
                      <h3 className="booking-summary-modal__step-title">Chọn khung giờ (có thể chọn nhiều)</h3>
                      <p className="booking-summary-modal__step-subtitle">{availableTimeSlots.length} khung giờ có sẵn</p>
                      {selectedTimes.length > 0 && (
                        <p className="booking-summary-modal__step-selected">
                          Đã chọn: {selectedTimes.map(t => formatTimeRange(t)).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="booking-summary-modal__time-grid">
                    {availableTimeSlots.map((slot, index) => {
                      const uniqueKey = `${selectedDate}-${slot.time}-${venue?.id || 'default'}`;
                      return (
                        <button
                          key={uniqueKey}
                          onClick={() => handleTimeChange(slot.time)}
                          className={`booking-summary-modal__time-slot ${selectedTimes.includes(slot.time) ? 'selected' : ''}`}
                        >
                          <div className="booking-summary-modal__time-slot-time">
                            {slot.displayTime}
                          </div>
                          <div className="booking-summary-modal__time-slot-price">
                            {(slot.price / 1000).toFixed(0)}K
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {currentStep === 2 && (
                    <div className="booking-summary-modal__step-tip">
                      <p>💡 Chọn một hoặc nhiều khung giờ phù hợp với lịch trình của bạn.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTimes.length > 0 && (
              <div 
                className={`booking-summary-modal__step ${currentStep >= 3 ? 'active' : 'inactive'}`}
                ref={el => stepRefs.current[3] = el}
              >
                <div className={`booking-summary-modal__step-content ${
                  currentStep === 3 ? 'current' : paymentMethod ? 'completed' : 'pending'
                }`}>
                  <div className="booking-summary-modal__step-header">
                    <div className={`booking-summary-modal__step-number ${paymentMethod ? 'completed' : 'current'}`}>
                      {paymentMethod ? '✓' : '3'}
                    </div>
                    <div className="booking-summary-modal__step-info">
                      <h3 className="booking-summary-modal__step-title">Chọn phương thức thanh toán</h3>
                      {paymentMethod && (
                        <p className="booking-summary-modal__step-selected">
                          Đã chọn: {paymentMethods.find(p => p.id === paymentMethod)?.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="booking-summary-modal__payment-grid">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`booking-summary-modal__payment-option ${
                          paymentMethod === method.id ? 'selected' : ''
                        }`}
                      >
                        <div className="booking-summary-modal__payment-info">
                          <span className="booking-summary-modal__payment-icon">{method.icon}</span>
                          <div className="booking-summary_modal__payment-details">
                            <div className="booking-summary-modal__payment-name">{method.name}</div>
                            <div className="booking-summary-modal__payment-description">{method.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {currentStep === 3 && (
                    <div className="booking-summary-modal__step-tip">
                      <p>💡 Chọn cách thức thanh toán thuận tiện nhất. Tất cả đều an toàn và bảo mật!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="booking-summary-modal__sidebar">
            {!showBookingSummary && (
              <div className="booking-summary-modal__progress">
                <div className="booking-summary-modal__progress-header">
                  <span className="booking-summary-modal__progress-title">Tiến trình đặt sân</span>
                  <span className="booking-summary-modal__progress-step">Bước {currentStep}/4</span>
                </div>
                
                <div className="booking-summary-modal__progress-tip">
                  <p>💡 Bạn có thể quay lại chỉnh sửa bất kỳ bước nào đã hoàn thành</p>
                </div>

                <div className="booking-summary-modal__progress-bar">
                  <div 
                    className="booking-summary-modal__progress-fill" 
                    style={{ 
                      width: `${
                        selectedDate ? 
                          (selectedTimes.length > 0 ? 
                            (paymentMethod ? 100 : 66) : 33) : 0
                      }%` 
                    }}
                  />
                </div>

                <div className="booking-summary-modal__progress-guidance">
                  <p className="booking-summary-modal__progress-guidance-text">
                    {!selectedDate && "👆 Bắt đầu bằng cách chọn ngày"}
                    {selectedDate && selectedTimes.length === 0 && "👆 Chọn khung giờ"}
                    {selectedTimes.length > 0 && !paymentMethod && "👆 Chọn cách thức thanh toán"}
                  </p>
                </div>
                
                <div className="booking-summary-modal__progress-steps">
                  {steps.map((step) => {
                    const StepIcon = step.icon;
                    const isActive = step.id === currentStep;
                    const isCompleted = step.completed;
                    
                    let maxAllowedStep = 1;
                    if (selectedDate) maxAllowedStep = 1.5;
                    if (selectedTimes.length > 0) maxAllowedStep = 2;
                    if (paymentMethod) maxAllowedStep = 3;
                    
                    const isClickable = step.id <= maxAllowedStep;
                    
                    return (
                      <div 
                        key={step.id} 
                        className={`booking-summary-modal__progress-step ${
                          isClickable ? 'clickable' : 'disabled'
                        }`}
                        onClick={() => handleStepClick(step.id)}
                        style={{ cursor: isClickable ? 'pointer' : 'not-allowed' }}
                      >
                        <div className={`booking-summary-modal__progress-step-icon ${
                          isCompleted ? 'completed' : isActive ? 'active' : 'pending'
                        }`}>
                          {isCompleted ? <Check size={16} /> : <StepIcon size={16} />}
                        </div>
                        <div className="booking-summary-modal__progress-step-content">
                          <div className={`booking-summary-modal__progress-step-title ${
                            isActive ? 'active' : isCompleted ? 'completed' : 'pending'
                          }`}>
                            {step.title}
                          </div>
                          {isActive && (
                            <div className="booking-summary-modal__progress-step-subtitle">
                              {currentStep === 1 && "Chọn ngày chơi"}
                              {currentStep === 2 && "Chọn khung giờ"}
                              {currentStep === 3 && "Chọn thanh toán"}
                              {currentStep === 4 && "Xác nhận đặt sân"}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {showBookingSummary && (
              <div 
                className="booking-summary-modal__summary"
                ref={el => stepRefs.current[5] = el}
              >
                <div className="booking-summary-modal__summary-header">
                  <div className="booking-summary-modal__summary-check">✓</div>
                  <h4 className="booking-summary-modal__summary-title">Thông tin đặt sân</h4>
                </div>
                
                <div className="booking-summary-modal__summary-details">
                  <div className="booking-summary-modal__summary-item">
                    <span className="booking-summary-modal__summary-label">Sân:</span>
                    <span className="booking-summary_modal__summary-value">{venue?.name}</span>
                  </div>
                  <div className="booking-summary-modal__summary-item">
                    <span className="booking-summary-modal__summary-label">Ngày:</span>
                    <span className="booking-summary_modal__summary-value">
                      {new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className="booking-summary-modal__summary-item">
                    <span className="booking-summary-modal__summary-label">Giờ:</span>
                    <span className="booking-summary_modal__summary-value">
                      {selectedTimes.map(time => formatTimeRange(time)).join(', ')}
                    </span>
                  </div>
                  <div className="booking-summary-modal__summary-item">
                    <span className="booking-summary-modal__summary-label">Sân được chọn:</span>
                    <span className="booking-summary_modal__summary-value">
                      {availableFields.find(f => f.id === selectedField)?.name || 'Sân tự động'}
                    </span>
                  </div>
                  <div className="booking-summary-modal__summary-item">
                    <span className="booking-summary-modal__summary-label">Thanh toán:</span>
                    <span className="booking-summary_modal__summary-value">
                      {paymentMethods.find(p => p.id === paymentMethod)?.name}
                    </span>
                  </div>
                  <div className="booking-summary-modal__summary-total">
                    <span className="booking-summary-modal__summary-total-label">Tổng tiền:</span>
                    <span className="booking-summary-modal__summary-total-value">
                      {totalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
                
                <div className="booking-summary-modal__summary-actions">
                  <button
                    onClick={handleConfirmBooking}
                    className="booking-summary-modal__confirm-button"
                  >
                    <CreditCard size={18} />
                    Xác nhận thanh toán
                  </button>
                  <p className="booking-summary-modal__security-note">🔒 Thanh toán an toàn</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {!showBookingSummary && (
          <div className="booking-summary-modal__footer">
            <div className="booking-summary-modal__footer-note">
              <p>✓ Miễn phí hủy đến 2h trước giờ chơi | 📞 Hỗ trợ: 1900-xxxx</p>
            </div>
          </div>
        )}

        {showSuccessPopup && (
          <div className="booking-success-popup">
            <div className="booking-success-popup__backdrop" onClick={handleCloseSuccessPopup} />
            <div className="booking-success-popup__content">
              <div className="booking-success-popup__header">
                <div className="booking-success-popup__check-circle">
                  <div className="booking-success-popup__check-icon">✓</div>
                </div>
                <h2 className="booking-success-popup__title">Đặt sân thành công!</h2>
              </div>

              <div className="booking-success-popup__details">
                <div className="booking-success-popup__booking-id">
                  <span className="booking-success-popup__id-label">Mã đặt sân</span>
                  <span className="booking-success-popup__id-value">{bookingId}</span>
                </div>

                <div className="booking-success-popup__summary">
                  <p>{venue?.name}</p>
                  <p>{selectedTimes.join(', ')} • {new Date(selectedDate).toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })}</p>
                  <p className="booking-success-popup__price">{(totalPrice / 1000).toFixed(0)}K VNĐ</p>
                </div>
              </div>

              <div className="booking-success-popup__actions">
                <button 
                  className="booking-success-popup__button"
                  onClick={handleCloseSuccessPopup}
                >
                  Xong
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSummaryModal;