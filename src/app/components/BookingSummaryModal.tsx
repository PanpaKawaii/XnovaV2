import React, { useState, useMemo, useEffect } from 'react';
import { X, MapPin, Calendar, Clock, Users, CreditCard, Check } from 'lucide-react';
import { Venue } from '../../settings/venue';

interface BookingSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  venue?: Venue;
  preSelectedDate?: string;
  preSelectedTimeSlot?: string;
}

const BookingSummaryModal: React.FC<BookingSummaryModalProps> = ({ 
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

  // Get available dates for this venue (currently not used, kept for future use)
  // const availableDates = useMemo(() => {
  //   if (!venue) return [];
  //   return venue.availability
  //     .filter(avail => avail.timeSlots.some(slot => slot.isAvailable))
  //     .map(avail => avail.date)
  //     .sort();
  // }, [venue]);

  // Get available time slots for selected date
  const availableTimeSlots = useMemo(() => {
    if (!venue || !selectedDate) return [];
    
    const dateAvailability = venue.availability.find(
      avail => avail.date === selectedDate
    );
    
    return dateAvailability ? dateAvailability.timeSlots.filter(slot => slot.isAvailable) : [];
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

  // Auto-select first available field when time is selected and fields are available
  useEffect(() => {
    if (selectedTime && !selectedField && availableFields.length > 0) {
      setSelectedField(availableFields[0].id);
    }
  }, [selectedTime, selectedField, availableFields]);

  // Auto-scroll to step 3 when modal opens with preSelectedTimeSlot
  useEffect(() => {
    if (isOpen && preSelectedTimeSlot && selectedTime && selectedField) {
      // Small delay to ensure DOM is rendered
      setTimeout(() => {
        const step3Element = document.querySelector('[data-step="3"]');
        if (step3Element) {
          step3Element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 300);
    }
  }, [isOpen, preSelectedTimeSlot, selectedTime, selectedField]);

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
    { id: 'momo', name: 'Ví MoMo', icon: '📱', description: 'Thanh toán qua ví điện tử MoMo' },
    { id: 'zalopay', name: 'ZaloPay', icon: '💳', description: 'Thanh toán qua ví ZaloPay' },
    { id: 'banking', name: 'Chuyển khoản', icon: '🏦', description: 'Chuyển khoản ngân hàng' },
    { id: 'cash', name: 'Tiền mặt', icon: '💵', description: 'Thanh toán tại sân' }
  ];

  const handleConfirmBooking = () => {
    console.log('Booking confirmed:', {
      venue: venue?.id,
      date: selectedDate,
      time: selectedTime,
      field: selectedField,
      paymentMethod,
      totalPrice
    });
    onClose();
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
    setSelectedField(''); // Reset field when date changes
    setPaymentMethod(''); // Reset payment method
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    setSelectedField(''); // Reset field when time changes
    setPaymentMethod(''); // Reset payment method
  };

  const handleFieldChange = (fieldId: string) => {
    setSelectedField(fieldId);
    setPaymentMethod(''); // Reset payment method when field changes
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-4xl w-full animate-fadeIn max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Đặt sân - {venue?.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Venue Quick Info */}
        <div className="flex-shrink-0 mb-4 p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🏟️</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">{venue?.name}</h3>
              <div className="flex items-center text-gray-400 text-sm">
                <MapPin size={12} className="mr-1" />
                <span>{venue?.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex gap-6 min-h-0">
          {/* Left Side - Steps Content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide pr-2">
            <div className="space-y-6">
              {/* Step 1: Date Selection */}
              <div className={`transition-all duration-300 ${currentStep >= 1 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <div className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                  currentStep === 1 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : selectedDate 
                      ? 'border-green-500 bg-green-500/10' 
                      : 'border-gray-600 bg-gray-800'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      selectedDate ? 'bg-green-500 text-white' : 'bg-purple-600 text-white'
                    }`}>
                      {selectedDate ? '✓' : '1'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Chọn ngày chơi</h3>
                      {selectedDate && (
                        <p className="text-sm text-green-400">
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
                    className="input-field w-full text-lg py-3"
                  />
                  {currentStep === 1 && (
                    <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-sm text-blue-300">
                        💡 Chọn ngày bạn muốn chơi (tối thiểu từ hôm nay). Kiểm tra lịch của bạn trước khi chọn!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Time Selection */}
              {selectedDate && (
                <div className={`transition-all duration-300 ${currentStep >= 2 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                  <div className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                    currentStep === 2 
                      ? 'border-purple-500 bg-purple-500/10' 
                      : selectedTime 
                        ? 'border-green-500 bg-green-500/10' 
                        : 'border-gray-600 bg-gray-800'
                  }`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        selectedTime ? 'bg-green-500 text-white' : 'bg-purple-600 text-white'
                      }`}>
                        {selectedTime ? '✓' : '2'}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Chọn khung giờ</h3>
                        <p className="text-sm text-gray-400">{availableTimeSlots.length} khung giờ có sẵn</p>
                        {selectedTime && (
                          <p className="text-sm text-green-400">Đã chọn: {selectedTime}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {availableTimeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => handleTimeChange(slot.time)}
                          className={`p-4 rounded-lg border text-sm font-medium transition-all ${
                            selectedTime === slot.time
                              ? 'bg-purple-600 border-purple-500 text-white'
                              : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                          }`}
                        >
                          <div className="font-semibold">{slot.time}</div>
                          <div className="text-xs text-green-400 mt-1">
                            {((slot.price || venue?.basePrice || 0) / 1000).toFixed(0)}K
                          </div>
                        </button>
                      ))}
                    </div>
                    {currentStep === 2 && (
                      <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <p className="text-sm text-orange-300">
                          💡 Chọn khung giờ phù hợp với lịch trình của bạn. Giá có thể thay đổi theo khung giờ!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Field Selection */}
              {selectedTime && (
                <div className={`transition-all duration-300 ${currentStep >= 3 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`} data-step="3">
                  <div className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                    currentStep === 3 
                      ? 'border-purple-500 bg-purple-500/10' 
                      : selectedField 
                        ? 'border-green-500 bg-green-500/10' 
                        : 'border-gray-600 bg-gray-800'
                  }`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        selectedField ? 'bg-green-500 text-white' : 'bg-purple-600 text-white'
                      }`}>
                        {selectedField ? '✓' : '3'}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Chọn sân</h3>
                        <p className="text-sm text-gray-400">{availableFields.length} sân có sẵn</p>
                        {selectedField && (
                          <p className="text-sm text-green-400">
                            Đã chọn: {availableFields.find(f => f.id === selectedField)?.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {availableFields.map((field) => (
                        <button
                          key={field.id}
                          onClick={() => handleFieldChange(field.id)}
                          className={`p-4 rounded-lg border text-left transition-all ${
                            selectedField === field.id
                              ? 'bg-purple-600 border-purple-500 text-white'
                              : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-base">{field.name}</div>
                              <div className="text-sm text-gray-400">{field.type}</div>
                            </div>
                            <div className="text-green-400 font-bold text-lg">
                              {(totalPrice / 1000).toFixed(0)}K
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {currentStep === 3 && (
                      <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-sm text-green-300">
                          💡 Chọn sân phù hợp với nhu cầu của bạn. Sân Premium có chất lượng cao hơn!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Payment Method Selection */}
              {selectedField && (
                <div className={`transition-all duration-300 ${currentStep >= 4 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                  <div className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                    currentStep === 4 
                      ? 'border-purple-500 bg-purple-500/10' 
                      : paymentMethod 
                        ? 'border-green-500 bg-green-500/10' 
                        : 'border-gray-600 bg-gray-800'
                  }`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        paymentMethod ? 'bg-green-500 text-white' : 'bg-purple-600 text-white'
                      }`}>
                        {paymentMethod ? '✓' : '4'}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Chọn phương thức thanh toán</h3>
                        {paymentMethod && (
                          <p className="text-sm text-green-400">
                            Đã chọn: {paymentMethods.find(p => p.id === paymentMethod)?.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`p-4 rounded-lg border text-left transition-all ${
                            paymentMethod === method.id
                              ? 'bg-purple-600 border-purple-500 text-white'
                              : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{method.icon}</span>
                            <div>
                              <div className="font-semibold">{method.name}</div>
                              <div className="text-xs text-gray-400">{method.description}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {currentStep === 4 && (
                      <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <p className="text-sm text-purple-300">
                          💡 Chọn cách thức thanh toán thuận tiện nhất. Tất cả đều an toàn và bảo mật!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Progress & Summary */}
          <div className="w-80 flex-shrink-0 space-y-4">
            {/* Steps Progress Indicator - Hidden when showing booking summary */}
            {!showBookingSummary && (
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-300">Tiến trình đặt sân</span>
                  <span className="text-sm text-gray-400">Bước {currentStep}/5</span>
                </div>
                
                <div className="mb-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-xs text-blue-300">
                    💡 Bạn có thể quay lại chỉnh sửa bất kỳ bước nào đã hoàn thành
                  </p>
                </div>
                
                <div className="space-y-4">
                  {steps.map((step) => {
                    const StepIcon = step.icon;
                    const isActive = step.id === currentStep;
                    const isCompleted = step.completed;
                    
                    return (
                      <div key={step.id} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : isActive 
                              ? 'bg-purple-600 text-white ring-2 ring-purple-400' 
                              : 'bg-gray-600 text-gray-400'
                        }`}>
                          {isCompleted ? <Check size={16} /> : <StepIcon size={16} />}
                        </div>
                        <div className="flex-1">
                          <div className={`text-sm font-medium ${
                            isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-gray-400'
                          }`}>
                            {step.title}
                          </div>
                          {isActive && (
                            <div className="text-xs text-gray-400 mt-1">
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
              <div className="bg-gray-800 rounded-lg p-4 border-2 border-green-500">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <h4 className="text-lg font-semibold text-white">
                    Thông tin đặt sân
                  </h4>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sân:</span>
                    <span className="text-white font-medium text-right">{venue?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ngày:</span>
                    <span className="text-white font-medium text-right">
                      {new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Giờ:</span>
                    <span className="text-white font-medium text-right">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sân:</span>
                    <span className="text-white font-medium text-right">
                      {availableFields.find(f => f.id === selectedField)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Thanh toán:</span>
                    <span className="text-white font-medium text-right">
                      {paymentMethods.find(p => p.id === paymentMethod)?.name}
                    </span>
                  </div>
                  <div className="border-t border-gray-700 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-white">Tổng tiền:</span>
                      <span className="text-xl font-bold text-green-400">
                        {totalPrice.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Confirm Button in Summary */}
                <div className="mt-4">
                  <button
                    onClick={handleConfirmBooking}
                    className="btn-secondary w-full flex items-center justify-center py-3 text-base font-semibold animate-pulse"
                  >
                    <CreditCard size={18} className="mr-2" />
                    Xác nhận thanh toán
                  </button>
                  <p className="text-xs text-center text-gray-400 mt-2">
                    🔒 Thanh toán an toàn
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Only show progress when not at final step */}
        {!showBookingSummary && (
          <div className="mt-6 flex-shrink-0">
            <div className="space-y-2">
              <div className="text-center">
                <p className="text-sm text-gray-300 mb-2 font-medium">
                  {!selectedDate && "👆 Bắt đầu bằng cách chọn ngày"}
                  {selectedDate && !selectedTime && "👆 Tiếp theo, chọn giờ chơi"}
                  {selectedTime && !selectedField && "👆 Chọn sân bạn muốn"}
                  {selectedField && !paymentMethod && "👆 Chọn cách thức thanh toán"}
                </p>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out relative" 
                    style={{ 
                      width: `${
                        selectedDate ? (selectedTime ? (selectedField ? (paymentMethod ? 100 : 75) : 50) : 25) : 0
                      }%` 
                    }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Tiến trình: {selectedDate ? (selectedTime ? (selectedField ? (paymentMethod ? '100' : '75') : '50') : '25') : '0'}% hoàn thành
                </p>
              </div>
            </div>
            
            <div className="text-center mt-3">
              <p className="text-xs text-gray-400">
                ✓ Miễn phí hủy đến 24h trước giờ chơi | 📞 Hỗ trợ: 1900-xxxx
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSummaryModal;