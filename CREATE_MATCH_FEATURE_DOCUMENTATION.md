# Tài Liệu Chức Năng Tạo Trận Đấu (Create Match Feature)

## Tổng Quan

Chức năng tạo trận đấu cho phép người dùng tạo các lời mời tham gia trận đấu thể thao với hai tùy chọn:
1. **Chưa có sân**: Người dùng điền đầy đủ thông tin về trận đấu bao gồm địa điểm, thời gian, và các chi tiết khác
2. **Đã có sân**: Người dùng chọn từ danh sách booking đã có, sau đó điền các thông tin còn thiếu

## Cấu Trúc Files

### 1. CreateMatchModal.jsx
**Đường dẫn**: `src/app/pages/userPage/FindTeammate/CreateMatchModal.jsx`

Component modal chính xử lý logic tạo trận đấu với các tính năng:
- Hiển thị màn hình chọn giữa 2 option
- Form nhập liệu cho option "Chưa có sân"
- Danh sách booking và form cho option "Đã có sân"
- Validation và gọi API

### 2. CreateMatchModal.css
**Đường dẫn**: `src/app/pages/userPage/FindTeammate/CreateMatchModal.css`

Stylesheet cho modal với responsive design và dark mode support.

### 3. FindTeammatePage.jsx (Updated)
**Đường dẫn**: `src/app/pages/userPage/FindTeammate/FindTeammatePage.jsx`

Trang chính được cập nhật để tích hợp modal tạo trận đấu.

### 4. api.js (Updated)
**Đường dẫn**: `src/app/services/api.js`

Service API được mở rộng với các endpoint mới cho invitations và bookings.

## API Endpoints

### Tạo Invitation (POST)
```
POST /invitations
```

**Request Body**:
```json
{
  "name": "string",              // * Bắt buộc
  "booked": 0,                   // 0 = chưa có sân, 1 = đã có sân
  "joiningCost": 0.0,            // Chi phí tham gia (VNĐ)
  "totalPlayer": 0,              // * Bắt buộc - Tổng số cầu thủ
  "availablePlayer": 0,          // * Bắt buộc - Số cầu thủ còn thiếu
  "standard": "string",          // Trình độ
  "kindOfSport": "string",       // Loại thể thao
  "location": "string",          // Địa điểm
  "longitude": "string",         // Kinh độ (optional)
  "latitude": "string",          // Vĩ độ (optional)
  "date": "2025-10-20T00:00:00", // * Bắt buộc - Ngày
  "startTime": "HH:mm",          // * Bắt buộc - Giờ bắt đầu
  "endTime": "HH:mm",            // * Bắt buộc - Giờ kết thúc
  "postingDate": "2025-10-15T00:00:00", // * Bắt buộc - Ngày đăng
  "status": 0,                   // Trạng thái
  "userId": 0,                   // * Bắt buộc - ID người tạo
  "bookingId": 0                 // ID booking (nếu có)
}
```

**Required Fields**:
- `name`
- `date`
- `startTime`
- `endTime`
- `postingDate`
- `userId`
- `totalPlayer`
- `availablePlayer`

### Lấy Bookings Theo User (GET)
```
GET /bookings/user/{userId}
```

**Response**: Danh sách bookings của user

## Luồng Sử Dụng

### Option 1: Chưa có sân

1. User nhấn button "Tạo Trận Đấu"
2. Chọn option "Chưa có sân"
3. Điền form với các thông tin:
   - Tên trận đấu *
   - Ngày *
   - Giờ bắt đầu *
   - Giờ kết thúc *
   - Địa điểm *
   - Tổng số cầu thủ *
   - Số cầu thủ cần tìm *
   - Chi phí tham gia (optional)
   - Trình độ (optional)
   - Loại thể thao (optional)
4. Nhấn "Tạo trận đấu"
5. System gọi API với `booked: 0` và `bookingId: 0`

### Option 2: Đã có sân

1. User nhấn button "Tạo Trận Đấu"
2. Chọn option "Đã có sân"
3. System tải danh sách bookings của user
4. User chọn một booking từ danh sách
5. System tự động điền: `date`, `startTime`, `endTime`, `location`, `bookingId`
6. User điền các thông tin còn thiếu:
   - Tên trận đấu *
   - Tổng số cầu thủ *
   - Số cầu thủ cần tìm *
   - Chi phí tham gia (optional)
   - Trình độ (optional)
   - Loại thể thao (optional)
7. Nhấn "Tạo trận đấu"
8. System gọi API với `booked: 1` và `bookingId` tương ứng

## Validation Rules

1. **Tên trận đấu**: Không được để trống
2. **Ngày**: Không được để trống, phải từ hôm nay trở đi
3. **Giờ bắt đầu**: Không được để trống
4. **Giờ kết thúc**: Không được để trống
5. **Địa điểm**: Không được để trống (nếu chưa có sân)
6. **Tổng số cầu thủ**: Phải > 0
7. **Số cầu thủ cần tìm**: Phải > 0 và <= tổng số cầu thủ
8. **Chi phí**: Phải >= 0
9. **User ID**: Phải có (người dùng phải đăng nhập)

## States và Props

### CreateMatchModal Component

**Props**:
- `isOpen`: boolean - Trạng thái hiển thị modal
- `onClose`: function - Callback khi đóng modal
- `onSuccess`: function - Callback khi tạo thành công

**Internal States**:
- `step`: 'choice' | 'without-booking' | 'with-booking'
- `loading`: boolean - Trạng thái đang xử lý
- `error`: string - Thông báo lỗi
- `userBookings`: array - Danh sách bookings của user
- `loadingBookings`: boolean - Trạng thái đang tải bookings
- `formData`: object - Dữ liệu form

## Error Handling

### Client-side Errors:
- Form validation errors
- User chưa đăng nhập
- Không có bookings (option 2)

### API Errors:
- Network errors
- Server errors (500)
- Validation errors từ backend
- Authentication errors

## Responsive Design

Modal được thiết kế responsive cho các kích thước màn hình:
- Desktop: Grid layout 2 cột cho options
- Tablet: Grid layout 2 cột rút gọn
- Mobile: Single column layout, full width buttons

## Dark Mode Support

Component hỗ trợ dark mode với CSS variables:
- Background colors
- Border colors
- Text colors
- Shadow effects

## Dependencies

### React Packages:
- `react` (hooks: useState, useEffect)
- `lucide-react` (icons)

### Custom Components:
- `Modal` - Base modal component
- `Button` - Styled button component

### Custom Hooks:
- `useAuth` - Authentication context

### Services:
- `bookingService` - API service

## Testing Checklist

### Functional Testing:
- [ ] Modal mở/đóng đúng cách
- [ ] Chuyển đổi giữa các steps
- [ ] Form validation hoạt động
- [ ] API call thành công
- [ ] Error handling hiển thị đúng
- [ ] Success callback được gọi

### User Flow Testing:
- [ ] Option "Chưa có sân" hoàn chỉnh
- [ ] Option "Đã có sân" hoàn chỉnh
- [ ] Load bookings thành công
- [ ] Select booking điền form tự động
- [ ] Submit form gọi API đúng

### UI/UX Testing:
- [ ] Responsive trên mobile
- [ ] Responsive trên tablet
- [ ] Dark mode hoạt động
- [ ] Animations mượt mà
- [ ] Icons hiển thị đúng
- [ ] Loading states rõ ràng

## Future Enhancements

1. **Map Integration**: Thêm bản đồ để chọn địa điểm
2. **Image Upload**: Upload ảnh cho trận đấu
3. **Invite Players**: Mời trực tiếp cầu thủ từ danh sách bạn bè
4. **Recurring Matches**: Tạo trận đấu định kỳ
5. **Advanced Filters**: Thêm filters cho bookings
6. **Calendar View**: Xem bookings trên calendar
7. **Notifications**: Thông báo khi tạo thành công
8. **Share**: Chia sẻ trận đấu lên social media

## Troubleshooting

### Issue: Modal không hiển thị
- Kiểm tra `isOpen` prop
- Kiểm tra CSS z-index
- Kiểm tra Modal component import

### Issue: API call failed
- Kiểm tra API endpoint URL
- Kiểm tra authentication token
- Kiểm tra request body format
- Check network tab trong DevTools

### Issue: Bookings không load
- Kiểm tra userId trong localStorage
- Kiểm tra API endpoint
- Kiểm tra response format
- Check console errors

### Issue: Form không submit
- Kiểm tra validation rules
- Kiểm tra required fields
- Kiểm tra error messages
- Check form data structure

## Code Example

### Sử dụng CreateMatchModal:

```jsx
import { CreateMatchModal } from './CreateMatchModal';

function MyComponent() {
  const [showModal, setShowModal] = useState(false);

  const handleMatchCreated = (newMatch) => {
    console.log('New match created:', newMatch);
    // Refresh matches list, navigate, etc.
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        Tạo Trận Đấu
      </Button>

      <CreateMatchModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleMatchCreated}
      />
    </>
  );
}
```

## Contact & Support

Nếu có vấn đề hoặc câu hỏi về chức năng này, vui lòng liên hệ team development.

---

**Version**: 1.0.0  
**Last Updated**: October 20, 2025  
**Author**: Development Team
