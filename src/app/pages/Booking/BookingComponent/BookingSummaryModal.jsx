import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, MapPin, Calendar, Clock, Users, CreditCard, Check, Plus, Minus, Target, Settings } from 'lucide-react';
import { fetchData, postData } from '../../../../mocks/CallingAPI.js';
import { useAuth } from '../../../hooks/AuthContext/AuthContext.jsx';
import './BookingSummaryModal.css';

const BookingSummaryModal = ({ isOpen, onClose, venue, preSelectedDate, preSelectedTimeSlot }) => {
  const { user } = useAuth();

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
      const token = user?.token || null;

      try {
        const fieldsResponse = await fetchData('Field', token);
        // const fields = Array.isArray(fieldsResponse) ? fieldsResponse : [fieldsResponse];
        const venueFieldsData = fieldsResponse.filter(field => field.venueId == venue.id);
        // console.log('venueFieldsData', venueFieldsData);


        const slotsResponse = await fetchData('Slot', token);
        // const slots = Array.isArray(slotsResponse) ? slotsResponse : [slotsResponse];
        const venueSlotsData = slotsResponse.filter(slot => venueFieldsData.some(field => field.id == slot.fieldId) && slot.status == 1);
        // console.log('venueSlotsData', venueSlotsData);

        const bookingsData = await fetchData('Booking', token);
        // const bookingsData = Array.isArray(bookingsResponse) ? bookingsResponse : [bookingsResponse];
        console.log('bookingsData', bookingsData);

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
    if (paymentMethod && selectedDate && selectedField && selectedTimes.length > 0) {
      setShowBookingSummary(true);
    } else {
      setShowBookingSummary(false);
    }
  }, [paymentMethod, selectedDate, selectedField, selectedTimes]);

  // Helper functions and calculations
  const calculateTotalPrice = () => {
    const basePrice = venueSlots.find(slot => slot.time === selectedTimes[0])?.price || venue?.basePrice || 0;
    return basePrice * selectedTimes.length;
  };

  const totalPrice = calculateTotalPrice();

  const handleFieldChange = (FieldId) => {
    setSelectedField(FieldId);
    setSelectedTimes([]);
    setPaymentMethod('');
  };

  // Handle time change
  const handleTimeChange = (SlotId) => {
    setSelectedTimes(prev => {
      if (prev.includes(SlotId)) {
        return prev.filter(t => t !== SlotId);
      } else {
        return [...prev, SlotId];
      }
    });
    setPaymentMethod('');
  };

  // Auto-scroll to payment step when modal opens with preSelectedTimeSlot
  useEffect(() => {
    if (isOpen && preSelectedTimeSlot && selectedTimes.length > 0) {
      setTimeout(() => {
        const paymentStepElement = stepRefs.current[4];
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

    if (selectedDate && !selectedField) {
      scrollToNextStep(2);
    } else if (selectedField && selectedTimes.length === 0) {
      scrollToNextStep(3);
    } else if (selectedTimes.length > 0 && !paymentMethod) {
      scrollToNextStep(4);
    } else if (paymentMethod && showBookingSummary) {
      scrollToNextStep(5);
    }
  }, [isOpen, selectedDate, selectedField, selectedTimes, paymentMethod, showBookingSummary]);

  // Steps definition
  const steps = [
    { id: 1, title: 'Chọn ngày', icon: Calendar, completed: !!selectedDate },
    { id: 2, title: 'Chọn sân', icon: MapPin, completed: !!selectedField },
    { id: 3, title: 'Chọn giờ', icon: Clock, completed: selectedTimes.length > 0 },
    { id: 4, title: 'Thanh toán', icon: CreditCard, completed: !!paymentMethod }
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
    if (!selectedField) return 2;
    if (selectedTimes.length === 0) return 3;
    if (!paymentMethod) return 4;
    return 5;
  }, [selectedDate, selectedField, selectedTimes, paymentMethod]);

  // Generate booking ID
  const generateBookingId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const BookField = async (payment, field, date, slots, amount) => {

    if (!payment || !field || !date || !slots || !amount) {
      return;
    }

    const BookingData = {
      id: 0,
      date: date,
      rating: 0,
      feedback: '',
      currentDate: new Date(),
      status: 2,
      userId: user.id,
      fieldId: field,
      slotIds: slots,
    };
    console.log('BookingData:', BookingData);

    if (payment == 'banking') {

      const token = user?.token;
      try {
        const result = await postData('Booking', BookingData, token);
        console.log('result', result);

        if (result.id) {
          // for (let index = 0; index < slots.length; index++) {
          //     const BookingSlotData = {
          //         id: 0,
          //         bookingId: result.id,
          //         slotId: slots[index],
          //     }
          //     console.log('BookingSlotData:', BookingSlotData);

          //     const resultBookingSlot = await postData('BookingSlot', BookingSlotData, token);
          //     console.log('resultBookingSlot', resultBookingSlot);
          // }

          const PaymentMethodData = {
            id: 0,
            orderId: result.id,
            fullname: '',
            description: '',
            amount: amount,
            status: '',
            method: '',
            createdDate: new Date,
          };
          console.log('PaymentMethodData:', PaymentMethodData);

          const resultPaymentMethod = await postData('Payment/create', PaymentMethodData, token);
          console.log('resultPaymentMethod', resultPaymentMethod);
          window.location.href = resultPaymentMethod.paymentUrl;
        }
      } catch (error) {
        setError(error);
      }
    }

    // const CashPaymentData = {
    //     id: 0,
    //     method: payment,
    //     amount: Amount,
    //     date: new Date(),
    //     status: 2,
    //     bookingId: 0,
    // };
    // console.log('CashPaymentData:', CashPaymentData);

    // if (payment === 'Thanh toán bằng tiền mặt') {
    //     try {
    //         const response = await fetch('https://localhost:7166/api/Payment', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //             },
    //             body: JSON.stringify(paymentData),
    //         });

    //         if (!response.ok) throw new Error('Network response was not ok');
    //         const result = await response.json();
    //         console.log('Creating Payment successful:', result);
    //     } catch (error) {
    //         console.error('Error during booking:', error);
    //     }
    // } else {
    //     try {
    //         const response = await fetch('https://localhost:7166/api/Payment/create', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //             },
    //             body: JSON.stringify(paymentMethodData),
    //         });

    //         if (!response.ok) throw new Error('Network response was not ok');
    //         const result = await response.json();
    //         console.log('Creating PaymentMethod successful:', result);
    //         window.location.href = result.paymentUrl;
    //     } catch (error) {
    //         console.error('Error during booking:', error);
    //     }
    // }
  };

  // Handle booking confirmation
  const handleConfirmBooking = () => {
    // const newBookingId = generateBookingId();
    console.log(paymentMethod, selectedField, selectedDate, selectedTimes, totalPrice);
    BookField(paymentMethod, selectedField, selectedDate, selectedTimes, totalPrice);
    // setBookingId(newBookingId);
    // setShowSuccessPopup(true);
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    onClose();
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedField('');
    setSelectedTimes([]);
    setPaymentMethod('');
  };

  // Handle step navigation
  const handleStepClick = (stepId) => {
    let maxAllowedStep = 1;
    if (selectedDate) maxAllowedStep = 1.5;
    if (selectedField) maxAllowedStep = 2;
    if (selectedTimes.length > 0) maxAllowedStep = 3;
    if (paymentMethod) maxAllowedStep = 4;

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
        2: 'chọn sân',
        3: 'chọn khung giờ',
        4: 'chọn phương thức thanh toán',
        5: 'xác nhận đặt sân'
      };

      const requiredSteps = {
        2: 'chọn ngày',
        3: 'chọn sân',
        4: 'khung giờ',
        5: 'hoàn thành tất cả các bước trước'
      };

      setWarningMessage(`Bạn cần ${requiredSteps[stepId]} trước khi ${stepNames[stepId]}!`);
      setShowWarning(true);

      setTimeout(() => {
        setShowWarning(false);
      }, 3000);
    }
  };

  console.log('bookings', bookings);
  console.log('selectedDate', selectedDate);
  const SameDateBooking = bookings?.filter(bk => bk.date == selectedDate);
  console.log('SameDateBooking', SameDateBooking);


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
          <h2 className="booking-summary-modal__title">Đặt sân - {venue?.name} [Date:{selectedDate} - Field:{selectedField} - Slot:{selectedTimes.join(', ')} - Payment:{paymentMethod}]</h2>
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
              <div className={`booking-summary-modal__step-content ${currentStep === 1 ? 'current' : selectedDate ? 'completed' : 'pending'
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
                <div className={`booking-summary-modal__step-content ${currentStep === 2 ? 'current' : selectedField ? 'completed' : 'pending'
                  }`}>
                  <div className="booking-summary-modal__step-header">
                    <div className={`booking-summary-modal__step-number ${selectedField ? 'completed' : 'current'}`}>
                      {selectedField ? '✓' : '2'}
                    </div>
                    <div className="booking-summary-modal__step-info">
                      <h3 className="booking-summary-modal__step-title">Chọn sân</h3>
                      <p className="booking-summary-modal__step-subtitle">{venueFields.length} sân giờ có sẵn</p>
                      {selectedField && (
                        <p className="booking-summary-modal__step-selected">
                          Đã chọn: {venueFields?.find(f => f.id == selectedField)?.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="booking-summary-modal__time-grid">
                    {venueFields.map((field, index) => (
                      <button
                        key={index}
                        onClick={() => handleFieldChange(field.id)}
                        className={`booking-summary-modal__time-slot ${selectedField == field.id ? 'selected' : ''}`}
                      >
                        <div className="booking-summary-modal__time-slot-time">
                          {field.name}
                        </div>
                      </button>
                    ))}
                  </div>
                  {currentStep === 2 && (
                    <div className="booking-summary-modal__step-tip">
                      <p>💡 Chọn sân yêu thích của bạn.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedField && (
              <div
                className={`booking-summary-modal__step ${currentStep >= 3 ? 'active' : 'inactive'}`}
                ref={el => stepRefs.current[3] = el}
              >
                <div className={`booking-summary-modal__step-content ${currentStep === 2 ? 'current' : selectedTimes.length > 0 ? 'completed' : 'pending'}`}>
                  <div className="booking-summary-modal__step-header">
                    <div className={`booking-summary-modal__step-number ${selectedTimes.length > 0 ? 'completed' : 'current'}`}>
                      {selectedTimes.length > 0 ? '✓' : '3'}
                    </div>
                    <div className="booking-summary-modal__step-info">
                      <h3 className="booking-summary-modal__step-title">Chọn khung giờ (có thể chọn nhiều)</h3>
                      <p className="booking-summary-modal__step-subtitle">{venueSlots?.filter(s => s.fieldId == selectedField)?.length} khung giờ có sẵn</p>
                      {selectedTimes.length > 0 && (
                        <p className="booking-summary-modal__step-selected">
                          Đã chọn: {venueSlots?.filter(s => selectedTimes.includes(s.id))?.map(slt => slt.name)?.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="booking-summary-modal__time-grid">
                    {venueSlots?.filter(s => s.fieldId == selectedField)?.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => handleTimeChange(slot.id)}
                        className={`booking-summary-modal__time-slot ${selectedTimes.includes(slot.id) ? 'selected' : ''}`}
                        disabled={SameDateBooking.some(booking =>
                          booking.bookingSlots.some(s => s.slotId == slot.id)
                        )}
                      >
                        {/* <div>{slot.id}</div> */}
                        <div className="booking-summary-modal__time-slot-time">
                          {slot.startTime?.substring(0, 5)} - {slot.endTime?.substring(0, 5)}
                        </div>
                        <div className="booking-summary-modal__time-slot-price">
                          {(slot.price / 1000).toFixed(0)}K
                        </div>
                      </button>
                    ))}
                  </div>
                  {currentStep === 3 && (
                    <div className="booking-summary-modal__step-tip">
                      <p>💡 Chọn một hoặc nhiều khung giờ phù hợp với lịch trình của bạn.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTimes.length > 0 && (
              <div
                className={`booking-summary-modal__step ${currentStep >= 4 ? 'active' : 'inactive'}`}
                ref={el => stepRefs.current[4] = el}
              >
                <div className={`booking-summary-modal__step-content ${currentStep === 4 ? 'current' : paymentMethod ? 'completed' : 'pending'
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
                        className={`booking-summary-modal__payment-option ${paymentMethod === method.id ? 'selected' : ''
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
                  {currentStep === 4 && (
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
                      width: `${selectedDate ?
                        (selectedField ?
                          (selectedTimes.length > 0 ?
                            (paymentMethod ? 100 : 75) : 50) : 25) : 0
                        }%`
                    }}
                  />
                </div>

                <div className="booking-summary-modal__progress-guidance">
                  <p className="booking-summary-modal__progress-guidance-text">
                    {!selectedDate && "👆 Bắt đầu bằng cách chọn ngày"}
                    {selectedDate && !selectedField && "👆 Chọn sân"}
                    {selectedField && selectedTimes.length === 0 && "👆 Chọn khung giờ"}
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
                    if (selectedField) maxAllowedStep = 2;
                    if (selectedTimes.length > 0) maxAllowedStep = 3;
                    if (paymentMethod) maxAllowedStep = 4;

                    const isClickable = step.id <= maxAllowedStep;

                    return (
                      <div
                        key={step.id}
                        className={`booking-summary-modal__progress-step ${isClickable ? 'clickable' : 'disabled'
                          }`}
                        onClick={() => handleStepClick(step.id)}
                        style={{ cursor: isClickable ? 'pointer' : 'not-allowed' }}
                      >
                        <div className={`booking-summary-modal__progress-step-icon ${isCompleted ? 'completed' : isActive ? 'active' : 'pending'
                          }`}>
                          {isCompleted ? <Check size={16} /> : <StepIcon size={16} />}
                        </div>
                        <div className="booking-summary-modal__progress-step-content">
                          <div className={`booking-summary-modal__progress-step-title ${isActive ? 'active' : isCompleted ? 'completed' : 'pending'
                            }`}>
                            {step.title}
                          </div>
                          {isActive && (
                            <div className="booking-summary-modal__progress-step-subtitle">
                              {currentStep === 1 && "Chọn ngày chơi"}
                              {currentStep === 2 && "Chọn sân"}
                              {currentStep === 3 && "Chọn khung giờ"}
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
                      {venueSlots?.filter(s => selectedTimes.includes(s.id))?.map(slt => slt.name)?.join(', ')}
                    </span>
                  </div>
                  <div className="booking-summary-modal__summary-item">
                    <span className="booking-summary-modal__summary-label">Sân được chọn:</span>
                    <span className="booking-summary_modal__summary-value">
                      {venueFields?.find(f => f.id == selectedField)?.name}
                    </span>
                  </div>
                  <div className="booking-summary-modal__summary-item">
                    <span className="booking-summary-modal__summary-label">Thanh toán:</span>
                    <span className="booking-summary_modal__summary-value">
                      {paymentMethods?.find(p => p.id === paymentMethod)?.name}
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
                  <button className="booking-summary-modal__confirm-button" onClick={handleConfirmBooking}>
                    <CreditCard size={18} />
                    Xác nhận thanh toán
                  </button>
                  <p className="booking-summary-modal__security-note"><i className='fa-solid fa-lock'></i> Thanh toán an toàn</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {!showBookingSummary && (
          <div className="booking-summary-modal__footer">
            <div className="booking-summary-modal__footer-note">
              <p><i className='fa-solid fa-check'></i> Miễn phí hủy đến 2h trước giờ chơi | <i className='fa-solid fa-phone'></i> Hỗ trợ: 1900-xxxx</p>
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
                <button className="booking-success-popup__button" onClick={handleCloseSuccessPopup}>
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