# Visual Guide - Create Match Feature

## 🎯 User Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FIND TEAMMATE PAGE                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Hero Section                            │  │
│  │  [Tham Gia Cộng Đồng]  [Tạo Trận Đấu] ← Click this │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              CREATE MATCH MODAL - Step 1                     │
│                                                              │
│        Tạo Trận Đấu Mới                                     │
│        Chọn cách tạo trận đấu của bạn                       │
│                                                              │
│  ┌──────────────────────┐    ┌──────────────────────┐     │
│  │     📍 MapPin         │    │   ✅ CheckCircle      │     │
│  │                       │    │                       │     │
│  │   Chưa có sân        │    │    Đã có sân         │     │
│  │                       │    │                       │     │
│  │ Tạo trận đấu với     │    │ Chọn từ các booking  │     │
│  │ thông tin đầy đủ     │    │ của bạn và điền      │     │
│  │                       │    │ thông tin còn thiếu  │     │
│  │                       │    │                       │     │
│  │     [Chọn]           │    │     [Chọn]           │     │
│  └──────────────────────┘    └──────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
           ↓                              ↓
┌──────────────────────┐    ┌──────────────────────────────┐
│ WITHOUT BOOKING      │    │ WITH BOOKING                  │
│                      │    │                               │
│ Form Fields:         │    │ 1. Select Booking             │
│ • Tên trận đấu *    │    │    ┌──────────────────────┐  │
│ • Ngày *            │    │    │ 📅 Sân ABC           │  │
│ • Giờ bắt đầu *     │    │    │ 📍 Q1, TPHCM         │  │
│ • Giờ kết thúc *    │    │    │ 🕐 18:00 - 20:00     │  │
│ • Địa điểm *        │    │    │    [Chọn]            │  │
│ • Tổng số cầu thủ * │    │    └──────────────────────┘  │
│ • Số cần tìm *      │    │                               │
│ • Chi phí           │    │ 2. Fill Remaining Fields      │
│ • Trình độ          │    │    • Tên trận đấu *          │
│ • Loại thể thao     │    │    • Tổng số cầu thủ *       │
│                      │    │    • Số cần tìm *            │
│ [Hủy] [Tạo trận đấu]│    │    • Chi phí                 │
└──────────────────────┘    │    • Trình độ                │
                            │    • Loại thể thao           │
                            │                               │
                            │    [Hủy] [Tạo trận đấu]      │
                            └──────────────────────────────┘
                 ↓                          ↓
           ┌─────────────────────────────────────┐
           │      API CALL                        │
           │  POST /invitations                   │
           │                                      │
           │  {                                   │
           │    name, date, time,                │
           │    location, players,               │
           │    userId, bookingId, etc...        │
           │  }                                   │
           └─────────────────────────────────────┘
                            ↓
                    ┌──────────────┐
                    │   SUCCESS     │
                    │               │
                    │ ✅ Trận đấu   │
                    │ đã được tạo!  │
                    └──────────────┘
```

## 📱 Screen Layouts

### Desktop View (> 768px)
```
┌────────────────────────────────────────────────────────┐
│  Tạo Trận Đấu - Chưa có sán              [Quay lại]   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  🏆 Tên trận đấu *                                    │
│  [_____________________]                               │
│                                                        │
│  📅 Ngày *        🕐 Giờ bắt đầu *    🕐 Giờ kết thúc *│
│  [__________]    [__________]         [__________]     │
│                                                        │
│  📍 Địa điểm *                                        │
│  [________________________________________________]   │
│                                                        │
│  👥 Tổng số cầu thủ *           👥 Số cầu thủ cần tìm *│
│  [__________]                   [__________]           │
│                                                        │
│  💰 Chi phí tham gia (VNĐ)                            │
│  [__________]                                          │
│                                                        │
│  Trình độ                       Loại thể thao         │
│  [▼ Chọn trình độ]             [▼ Bóng đá]           │
│                                                        │
├────────────────────────────────────────────────────────┤
│                           [Hủy]  [Tạo trận đấu]       │
└────────────────────────────────────────────────────────┘
```

### Mobile View (< 768px)
```
┌──────────────────────────┐
│ Tạo Trận Đấu             │
│              [Quay lại]  │
├──────────────────────────┤
│                          │
│ 🏆 Tên trận đấu *       │
│ [__________________]     │
│                          │
│ 📅 Ngày *               │
│ [__________________]     │
│                          │
│ 🕐 Giờ bắt đầu *        │
│ [__________________]     │
│                          │
│ 🕐 Giờ kết thúc *       │
│ [__________________]     │
│                          │
│ 📍 Địa điểm *           │
│ [__________________]     │
│                          │
│ 👥 Tổng số cầu thủ *    │
│ [__________________]     │
│                          │
│ 👥 Số cần tìm *         │
│ [__________________]     │
│                          │
│ 💰 Chi phí              │
│ [__________________]     │
│                          │
│ Trình độ                 │
│ [▼ Chọn trình độ]       │
│                          │
│ Loại thể thao            │
│ [▼ Bóng đá]             │
│                          │
├──────────────────────────┤
│ [        Hủy        ]   │
│ [ Tạo trận đấu     ]   │
└──────────────────────────┘
```

## 🎨 Color Scheme

```
Primary Actions:
  ┌──────────────────┐
  │ Tạo trận đấu     │  ← Green gradient with glow
  └──────────────────┘
      background: linear-gradient(135deg, #22c55e, #16a34a)
      color: white
      box-shadow: 0 0 20px rgba(34, 197, 94, 0.3)

Secondary Actions:
  ┌──────────────────┐
  │      Hủy         │  ← Outline button
  └──────────────────┘
      border: 2px solid var(--border-primary)
      background: transparent
      color: var(--text-primary)

Option Cards (Hover):
  ┌──────────────────┐
  │    📍 MapPin     │
  │                  │
  │  Chưa có sân    │  ← Lift + border change
  └──────────────────┘
      transform: translateY(-4px)
      border-color: var(--accent-primary)
      box-shadow: 0 8px 20px var(--shadow-primary)

Selected Booking:
  ┌──────────────────┐
  │ ✅ Booking đã   │  ← Green tint
  │    chọn          │
  └──────────────────┘
      background: linear-gradient(135deg, 
        rgba(34, 197, 94, 0.1), 
        rgba(22, 163, 74, 0.05))
      border: 2px solid var(--accent-primary)
```

## 🔄 State Transitions

```
Initial State (step = 'choice')
        ↓
    [User Action]
        ↓
  ┌─────┴─────┐
  ↓           ↓
without     with
booking     booking
  ↓           ↓
  │           │ → fetchUserBookings()
  │           │ → loadingBookings = true
  │           ↓
  │       bookings loaded
  │           ↓
  │       select booking
  │           ↓
  │    bookingId filled
  ↓           ↓
form      form
filled    filled
  ↓           ↓
validate  validate
  ↓           ↓
  └─────┬─────┘
        ↓
    loading = true
        ↓
   API call
        ↓
    ┌───┴───┐
    ↓       ↓
 Success  Error
    ↓       ↓
callback  show
    ↓    error
  close     ↓
  modal   retry
```

## 🎭 Animation Timeline

```
Modal Open:
  0ms   ─────────────────────────►
        Backdrop fade in
        Modal scale up (0.9 → 1)

Choice Selection:
  0ms   ─────────────────────────►
        Card hover lift (-4px)
        Border color change
        Shadow increase

Form Submit:
  0ms   ─────────────────────────►
        Button disable
        Text change "Đang tạo..."
        Loading spinner (optional)

Success:
  0ms   ─────────────────────────►
        Success alert
        Modal fade out
        Backdrop fade out
```

## 📊 Data Structure

```javascript
formData = {
  // Required fields
  name: "Giao hữu cuối tuần",
  date: "2025-10-25",
  startTime: "18:00",
  endTime: "20:00",
  totalPlayer: 10,
  availablePlayer: 5,
  
  // Auto-filled (with booking)
  location: "Sân ABC, Q1, TPHCM",
  bookingId: 123,
  booked: 1,
  
  // Optional fields
  joiningCost: 100000,
  standard: "Trung bình",
  kindOfSport: "Bóng đá",
  longitude: "",
  latitude: "",
}
```

---

**Created**: October 20, 2025  
**Version**: 1.0.0
