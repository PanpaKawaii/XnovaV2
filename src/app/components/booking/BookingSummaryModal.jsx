import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, MapPin, Calendar, Clock, Users, CreditCard, Check } from 'lucide-react';
import './BookingSummaryModal.css';

const BookingSummaryModal = ({ 
  isOpen, 
  onClose, 
  venue,
  preSelectedDate,
  preSelectedTimeSlot 
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showBookingSummary, setShowBookingSummary] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Refs for auto-scrolling
  const stepRefs = useRef({});
  const modalContentRef = useRef(null);

  // Auto-populate with pre-selected values
  useEffect(() => {
    if (preSelectedDate) {
      setSelectedDate(preSelectedDate);
    }
    if (preSelectedTimeSlot && preSelectedTimeSlot !== 'Mọi khung giờ') {
      if (preSelectedTimeSlot.includes('-')) {
        // Don't auto-select time ranges, let user choose specific time
      } else {
        setSelectedTime(preSelectedTimeSlot);
      }
    }
  }, [preSelectedDate, preSelectedTimeSlot]);

  // Show booking summary when payment method is selected
  useEffect(() => {
    if (paymentMethod && selectedDate && selectedTime && selectedField) {
      setShowBookingSummary(true);
    } else {
      setShowBookingSummary(false);
    }
  }, [paymentMethod, selectedDate, selectedTime, selectedField]);

  // Get available time slots for selected date
  const availableTimeSlots = useMemo(() => {
    if (!venue || !selectedDate) return [];
    
    const dateAvailability = venue.availability && venue.availability.find(
      avail => avail.date === selectedDate
    );
    
    if (dateAvailability) {
      return dateAvailability.timeSlots.filter(slot => slot.isAvailable);
    }
    
    // Mock time slots if no availability data
    return [
      { time: '06:00', price: venue.basePrice || 200000, isAvailable: true },
      { time: '07:00', price: venue.basePrice || 200000, isAvailable: true },
      { time: '08:00', price: venue.basePrice || 200000, isAvailable: true },
      { time: '09:00', price: venue.basePrice || 200000, isAvailable: true },
      { time: '10:00', price: venue.basePrice || 200000, isAvailable: true },
      { time: '11:00', price: venue.basePrice || 200000, isAvailable: true },
      { time: '14:00', price: venue.basePrice || 200000, isAvailable: true },
      { time: '15:00', price: venue.basePrice || 200000, isAvailable: true },
      { time: '16:00', price: venue.basePrice || 200000, isAvailable: true },
      { time: '17:00', price: venue.basePrice || 200000, isAvailable: true },
      { time: '18:00', price: venue.basePrice || 200000, isAvailable: true },
      { time: '19:00', price: venue.basePrice || 200000, isAvailable: true }
    ];
  }, [venue, selectedDate]);

  // Get available fields for selected time slot
  const availableFields = useMemo(() => {
    if (!selectedTime) return [];
    
    // Mock field data - in real app this would come from the venue data
    const fields = [
      { id: 'field-1', name: 'Sân 1', type: venue?.type || 'Standard' },
      { id: 'field-2', name: 'Sân 2', type: venue?.type || 'Standard' },
      { id: 'field-3', name: 'Sân 3', type: venue?.type || 'Premium' }
    ];
    
    // Filter based on availability (mock logic)
    return fields.filter(() => Math.random() > 0.3); // 70% chance of being available
  }, [selectedTime, venue]);

  const selectedTimeSlot = availableTimeSlots.find(slot => slot.time === selectedTime);
  const totalPrice = selectedTimeSlot?.price || venue?.basePrice || 0;

  // Remove auto-select first available field - let user choose
  // useEffect(() => {
  //   if (selectedTime && !selectedField && availableFields.length > 0) {
  //     setSelectedField(availableFields[0].id);
  //   }
  // }, [selectedTime, selectedField, availableFields]);

  // Auto-scroll to step 3 when modal opens with preSelectedTimeSlot
  useEffect(() => {
    if (isOpen && preSelectedTimeSlot && selectedTime && selectedField) {
      // Small delay to ensure DOM is rendered
      setTimeout(() => {
        const step3Element = stepRefs.current[3];
        if (step3Element && modalContentRef.current) {
          step3Element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 300);
    }
  }, [isOpen, preSelectedTimeSlot, selectedTime, selectedField]);

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
      }, 500); // Delay to allow user to see completion
    };

    // Scroll to step 2 when date is selected
    if (selectedDate && !selectedTime) {
      scrollToNextStep(2);
    }
    // Scroll to step 3 when time is selected
    else if (selectedTime && !selectedField) {
      scrollToNextStep(3);
    }
    // Scroll to step 4 when field is selected
    else if (selectedField && !paymentMethod) {
      scrollToNextStep(4);
    }
    // Scroll to summary when payment method is selected
    else if (paymentMethod && showBookingSummary) {
      scrollToNextStep(5);
    }
  }, [isOpen, selectedDate, selectedTime, selectedField, paymentMethod, showBookingSummary]);

  // Calculate current step for progress indicator
  const getCurrentStep = () => {
    if (!selectedDate) return 1;
    if (!selectedTime) return 2;
    if (!selectedField) return 3;
    if (!paymentMethod) return 4;
    return 5; // Confirmation step
  };

  const currentStep = getCurrentStep();

  const steps = [
    { id: 1, title: 'Chọn ngày', icon: Calendar, completed: !!selectedDate },
    { id: 2, title: 'Chọn giờ', icon: Clock, completed: !!selectedTime },
    { id: 3, title: 'Chọn sân', icon: Users, completed: !!selectedField },
    { id: 4, title: 'Thanh toán', icon: CreditCard, completed: !!paymentMethod },
    { id: 5, title: 'Xác nhận', icon: Check, completed: showBookingSummary }
  ];

  const paymentMethods = [
    { id: 'momo', name: 'Ví MoMo', icon: '�', description: 'Thanh toán qua ví điện tử MoMo' },
    { id: 'zalopay', name: 'ZaloPay', icon: '💳', description: 'Thanh toán qua ví ZaloPay' },
    { id: 'banking', name: 'Chuyển khoản', icon: '🏦', description: 'Chuyển khoản ngân hàng' },
    { id: 'cash', name: 'Tiền mặt', icon: '💵', description: 'Thanh toán tại sân' }
  ];

  const handleConfirmBooking = () => {
    // Generate booking ID
    const newBookingId = `BK${Date.now().toString().slice(-8)}`;
    setBookingId(newBookingId);

    console.log('Booking confirmed:', {
      bookingId: newBookingId,
      venue: venue?.id,
      date: selectedDate,
      time: selectedTime,
      field: selectedField,
      paymentMethod,
      totalPrice
    });

    // Show success popup
    setShowSuccessPopup(true);
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    onClose(); // Close main modal after success popup
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
    setSelectedField(''); // Reset field when date changes
    setPaymentMethod(''); // Reset payment method
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    setSelectedField(''); // Reset field when time changes
    setPaymentMethod(''); // Reset payment method
  };

  const handleFieldChange = (fieldId) => {
    setSelectedField(fieldId);
    setPaymentMethod(''); // Reset payment method when field changes
  };

  // Handle step navigation
  const handleStepClick = (stepId) => {
    // Determine max allowed step based on completed data
    let maxAllowedStep = 1;
    if (selectedDate) maxAllowedStep = 2;
    if (selectedTime) maxAllowedStep = 3;
    if (selectedField) maxAllowedStep = 4;
    if (paymentMethod) maxAllowedStep = 5;

    // Allow navigation to completed steps or current step
    if (stepId <= maxAllowedStep) {
      // Scroll to the selected step
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
      // Show warning for inaccessible steps
      const stepNames = {
        2: 'chọn khung giờ',
        3: 'chọn sân', 
        4: 'chọn phương thức thanh toán',
        5: 'xác nhận đặt sân'
      };
      
      const requiredSteps = {
        2: 'chọn ngày',
        3: 'chọn ngày và khung giờ',
        4: 'chọn ngày, khung giờ và sân',
        5: 'hoàn thành tất cả các bước trước'
      };

      setWarningMessage(`Bạn cần ${requiredSteps[stepId]} trước khi ${stepNames[stepId]}!`);
      setShowWarning(true);
      
      // Auto hide warning after 3 seconds
      setTimeout(() => {
        setShowWarning(false);
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="booking-summary-modal">
      <div className="booking-summary-modal__content" ref={modalContentRef}>
        {/* Warning Toast */}
        {showWarning && (
          <div className="booking-summary-modal__warning-toast">
            <div className="booking-summary-modal__warning-content">
              <span className="booking-summary-modal__warning-icon">⚠️</span>
              <span className="booking-summary-modal__warning-text">{warningMessage}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="booking-summary-modal__header">
          <h2 className="booking-summary-modal__title">Đặt sân - {venue?.name}</h2>
          <button onClick={onClose} className="booking-summary-modal__close">
            <X size={24} />
          </button>
        </div>

        {/* Venue Quick Info */}
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

        {/* Main Content Area */}
        <div className="booking-summary-modal__main">
          {/* Left Side - Steps Content */}
          <div className="booking-summary-modal__steps">
            {/* Step 1: Date Selection */}
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

            {/* Step 2: Time Selection */}
            {selectedDate && (
              <div 
                className={`booking-summary-modal__step ${currentStep >= 2 ? 'active' : 'inactive'}`}
                ref={el => stepRefs.current[2] = el}
              >
                <div className={`booking-summary-modal__step-content ${
                  currentStep === 2 ? 'current' : selectedTime ? 'completed' : 'pending'
                }`}>
                  <div className="booking-summary-modal__step-header">
                    <div className={`booking-summary-modal__step-number ${selectedTime ? 'completed' : 'current'}`}>
                      {selectedTime ? '✓' : '2'}
                    </div>
                    <div className="booking-summary-modal__step-info">
                      <h3 className="booking-summary-modal__step-title">Chọn khung giờ</h3>
                      <p className="booking-summary-modal__step-subtitle">{availableTimeSlots.length} khung giờ có sẵn</p>
                      {selectedTime && (
                        <p className="booking-summary-modal__step-selected">Đã chọn: {selectedTime}</p>
                      )}
                    </div>
                  </div>
                  <div className="booking-summary-modal__time-grid">
                    {availableTimeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => handleTimeChange(slot.time)}
                        className={`booking-summary-modal__time-slot ${
                          selectedTime === slot.time ? 'selected' : ''
                        }`}
                      >
                        <div className="booking-summary-modal__time-slot-time">{slot.time}</div>
                        <div className="booking-summary-modal__time-slot-price">
                          {((slot.price || venue?.basePrice || 0) / 1000).toFixed(0)}K
                        </div>
                      </button>
                    ))}
                  </div>
                  {currentStep === 2 && (
                    <div className="booking-summary-modal__step-tip">
                      <p>💡 Chọn khung giờ phù hợp với lịch trình của bạn. Giá có thể thay đổi theo khung giờ!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Field Selection */}
            {selectedTime && (
              <div 
                className={`booking-summary-modal__step ${currentStep >= 3 ? 'active' : 'inactive'}`} 
                ref={el => stepRefs.current[3] = el}
              >
                <div className={`booking-summary-modal__step-content ${
                  currentStep === 3 ? 'current' : selectedField ? 'completed' : 'pending'
                }`}>
                  <div className="booking-summary-modal__step-header">
                    <div className={`booking-summary-modal__step-number ${selectedField ? 'completed' : 'current'}`}>
                      {selectedField ? '✓' : '3'}
                    </div>
                    <div className="booking-summary-modal__step-info">
                      <h3 className="booking-summary-modal__step-title">Chọn sân</h3>
                      <p className="booking-summary-modal__step-subtitle">{availableFields.length} sân có sẵn</p>
                      {selectedField ? (
                        <p className="booking-summary-modal__step-selected">
                          Đã chọn: {availableFields.find(f => f.id === selectedField)?.name}
                        </p>
                      ) : (
                        <p className="booking-summary-modal__step-prompt">
                          👆 Vui lòng chọn sân để tiếp tục
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="booking-summary-modal__field-grid">
                    {availableFields.map((field) => (
                      <button
                        key={field.id}
                        onClick={() => handleFieldChange(field.id)}
                        className={`booking-summary-modal__field-option ${
                          selectedField === field.id ? 'selected' : ''
                        }`}
                      >
                        <div className="booking-summary-modal__field-info">
                          <div className="booking-summary-modal__field-name">{field.name}</div>
                          <div className="booking-summary-modal__field-type">{field.type}</div>
                        </div>
                        <div className="booking-summary-modal__field-price">
                          {(totalPrice / 1000).toFixed(0)}K
                        </div>
                      </button>
                    ))}
                  </div>
                  {currentStep === 3 && (
                    <div className="booking-summary-modal__step-tip">
                      <p>💡 Chọn sân phù hợp với nhu cầu của bạn. Sân Premium có chất lượng cao hơn! Hãy xem xét kỹ trước khi quyết định.</p>
                    </div>
                  )}
                  {!selectedField && currentStep === 3 && (
                    <div className="booking-summary-modal__step-suggestion">
                      <p>🎯 <strong>Gợi ý:</strong> Nếu đây là lần đầu chơi, hãy chọn sân Standard để trải nghiệm. Sân Premium phù hợp cho người chơi có kinh nghiệm.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Payment Method Selection */}
            {selectedField && (
              <div 
                className={`booking-summary-modal__step ${currentStep >= 4 ? 'active' : 'inactive'}`}
                ref={el => stepRefs.current[4] = el}
              >
                <div className={`booking-summary-modal__step-content ${
                  currentStep === 4 ? 'current' : paymentMethod ? 'completed' : 'pending'
                }`}>
                  <div className="booking-summary-modal__step-header">
                    <div className={`booking-summary-modal__step-number ${paymentMethod ? 'completed' : 'current'}`}>
                      {paymentMethod ? '✓' : '4'}
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
                          <div className="booking-summary-modal__payment-details">
                            <div className="booking-summary-modal__payment-name">{method.name}</div>
                            <div className="booking-summary-modal__payment-description">{method.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {currentStep === 4 && (
                    <div className="booking-summary-modal__step-tip">
                      <p>💡 Chọn cách thức thanh toán thuận tiện nhất. Tất cả đều an toàn và bảo mật!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Progress & Summary */}
          <div className="booking-summary-modal__sidebar">
            {/* Steps Progress Indicator - Hidden when showing booking summary */}
            {!showBookingSummary && (
              <div className="booking-summary-modal__progress">
                <div className="booking-summary-modal__progress-header">
                  <span className="booking-summary-modal__progress-title">Tiến trình đặt sân</span>
                  <span className="booking-summary-modal__progress-step">Bước {currentStep}/5</span>
                </div>
                
                <div className="booking-summary-modal__progress-tip">
                  <p>💡 Bạn có thể quay lại chỉnh sửa bất kỳ bước nào đã hoàn thành</p>
                </div>

                {/* Progress Bar */}
                <div className="booking-summary-modal__progress-bar">
                  <div 
                    className="booking-summary-modal__progress-fill" 
                    style={{ 
                      width: `${
                        selectedDate ? (selectedTime ? (selectedField ? (paymentMethod ? 100 : 75) : 50) : 25) : 0
                      }%` 
                    }}
                  />
                </div>

                {/* Footer Text - More Prominent */}
                <div className="booking-summary-modal__progress-guidance">
                  <p className="booking-summary-modal__progress-guidance-text">
                    {!selectedDate && "👆 Bắt đầu bằng cách chọn ngày"}
                    {selectedDate && !selectedTime && "👆 Tiếp theo, chọn giờ chơi"}
                    {selectedTime && !selectedField && "👆 Chọn sân bạn muốn"}
                    {selectedField && !paymentMethod && "👆 Chọn cách thức thanh toán"}
                  </p>
                </div>
                
                <div className="booking-summary-modal__progress-steps">
                  {steps.map((step) => {
                    const StepIcon = step.icon;
                    const isActive = step.id === currentStep;
                    const isCompleted = step.completed;
                    
                    // Determine if step is clickable
                    let maxAllowedStep = 1;
                    if (selectedDate) maxAllowedStep = 2;
                    if (selectedTime) maxAllowedStep = 3;
                    if (selectedField) maxAllowedStep = 4;
                    if (paymentMethod) maxAllowedStep = 5;
                    
                    const isClickable = step.id <= maxAllowedStep;
                    
                    return (
                      <div 
                        key={step.id} 
                        className={`booking-summary-modal__progress-step-item ${
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
                              {currentStep === 3 && "Chọn sân"}
                              {currentStep === 4 && "Chọn thanh toán"}
                              {currentStep === 5 && "Xác nhận đặt sân"}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Booking Summary - Show when ready */}
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
                    <span className="booking-summary-modal__summary-value">{venue?.name}</span>
                  </div>
                  <div className="booking-summary-modal__summary-item">
                    <span className="booking-summary-modal__summary-label">Ngày:</span>
                    <span className="booking-summary-modal__summary-value">
                      {new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className="booking-summary-modal__summary-item">
                    <span className="booking-summary-modal__summary-label">Giờ:</span>
                    <span className="booking-summary-modal__summary-value">{selectedTime}</span>
                  </div>
                  <div className="booking-summary-modal__summary-item">
                    <span className="booking-summary-modal__summary-label">Sân:</span>
                    <span className="booking-summary-modal__summary-value">
                      {availableFields.find(f => f.id === selectedField)?.name}
                    </span>
                  </div>
                  <div className="booking-summary-modal__summary-item">
                    <span className="booking-summary-modal__summary-label">Thanh toán:</span>
                    <span className="booking-summary-modal__summary-value">
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
                
                {/* Confirm Button in Summary */}
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

        {/* Action Buttons - Only show progress when not at final step */}
        {!showBookingSummary && (
          <div className="booking-summary-modal__footer">
            <div className="booking-summary-modal__footer-note">
              <p>✓ Miễn phí hủy đến 2h trước giờ chơi | 📞 Hỗ trợ: 1900-xxxx</p>
            </div>
          </div>
        )}

        {/* Warning Message - Show when user tries to skip steps */}
        {showWarning && (
          <div className="booking-summary-modal__warning" id="booking-summary-modal__warning">
            <p className="booking-summary-modal__warning-message">{warningMessage}</p>
          </div>
        )}
      </div>

      {/* Success Popup */}
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
                <p>{selectedTime} • {new Date(selectedDate).toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' })}</p>
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
  );
};

export default BookingSummaryModal;
