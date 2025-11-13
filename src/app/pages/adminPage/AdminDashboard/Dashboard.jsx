import React, { useEffect, useState } from 'react';
import { Calendar, Users, MapPin, TrendingUp } from 'lucide-react';
import { StatsCard } from '../../../components/admincomponents/Dashboard/StatsCard';
import { Chart } from '../../../components/admincomponents/Dashboard/Chart';
import { fetchData } from '../../../../mocks/CallingAPI.js';
import { useAuth } from '../../../hooks/AuthContext/AuthContext.jsx';
import './Dashboard.css';

// Mock data mở rộng cho filter theo thời gian
const generateMockData = () => {
  const data = [];
  const today = new Date();
  
  // Tạo dữ liệu cho 365 ngày (1 năm)
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Random số booking và amount với pattern hợp lý
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const baseBookings = isWeekend ? 20 : 15;
    const bookings = baseBookings + Math.floor(Math.random() * 10);
    
    const baseAmount = isWeekend ? 3500000 : 2500000;
    const amount = baseAmount + Math.floor(Math.random() * 2000000);
    
    data.push({
      date: date.toISOString(),
      amount: amount,
      bookings: bookings
    });
  }
  
  return data;
};

const mockFullData = generateMockData();

// Dữ liệu 7 ngày gần nhất để hiển thị mặc định
const mockRevenueData = mockFullData.slice(-7);

const mockDashboardStats = {
  utilizationRate: 68
};

export const Dashboard = () => {
  const { user } = useAuth();
  const [totalUsers, setTotalUsers] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userError, setUserError] = useState(null);
  const [todayBookings, setTodayBookings] = useState(0);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState(null);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [bookingChartData, setBookingChartData] = useState([]);
  const [bookingFullData, setBookingFullData] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [revenueFullData, setRevenueFullData] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setUserError(null);
      try {
        const token = user?.token;
        if (!token) {
          setTotalUsers(0);
          setLoadingUsers(false);
          return;
        }
        const users = await fetchData('User', token);
        const customerCount = Array.isArray(users)
          ? users.filter(u => u.role === 'Customer').length
          : 0;
        setTotalUsers(customerCount);
      } catch (err) {
        setUserError('Lỗi khi tải dữ liệu người dùng');
        setTotalUsers(0);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [user]);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoadingBookings(true);
      setBookingError(null);
      setLoadingRevenue(true);
      try {
        const token = user?.token;
        if (!token) {
          setTodayBookings(0);
          setTodayRevenue(0);
          setLoadingBookings(false);
          setLoadingRevenue(false);
          return;
        }
        const bookings = await fetchData('booking', token);
        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10);
        setTotalBookings(Array.isArray(bookings) ? bookings.length : 0);
        // Đếm số booking có date === todayStr
        const count = Array.isArray(bookings)
          ? bookings.filter(b => {
              if (!b.date) return false;
              return b.date.slice(0, 10) === todayStr;
            }).length
          : 0;
        setTodayBookings(count);

        // Tính tổng amount của payments có date === todayStr
        let revenue = 0;
        let totalRevenueSum = 0;
        if (Array.isArray(bookings)) {
          bookings.forEach(b => {
            if (Array.isArray(b.payments)) {
              b.payments.forEach(p => {
                if (p.date && p.date.slice(0, 10) === todayStr && typeof p.amount === 'number') {
                  revenue += p.amount;
                }
                if (typeof p.amount === 'number') {
                  totalRevenueSum += p.amount;
                }
              });
            }
          });
        }
        setTodayRevenue(revenue);
        setTotalRevenue(totalRevenueSum);

        // Chuẩn hóa dữ liệu biểu đồ booking theo ngày từ API
        const countsByDay = new Map();
        if (Array.isArray(bookings)) {
          bookings.forEach(b => {
            if (!b.date) return;
            const dayKey = b.date.slice(0, 10); // yyyy-mm-dd
            countsByDay.set(dayKey, (countsByDay.get(dayKey) || 0) + 1);
          });
        }
        // Sắp xếp theo ngày tăng dần và tạo mảng fullData
        const sortedDays = Array.from(countsByDay.keys()).sort();
        const fullDataFromApi = sortedDays.map(d => ({ date: d, bookings: countsByDay.get(d) }));
        setBookingFullData(fullDataFromApi);
        setBookingChartData(fullDataFromApi.slice(-7));

        // Chuẩn hóa dữ liệu biểu đồ doanh thu theo ngày từ API (tổng amount theo từng ngày payments)
        const amountsByDay = new Map();
        if (Array.isArray(bookings)) {
          bookings.forEach(b => {
            if (Array.isArray(b.payments)) {
              b.payments.forEach(p => {
                if (!p?.date || typeof p.amount !== 'number') return;
                const dayKey = p.date.slice(0, 10); // yyyy-mm-dd
                amountsByDay.set(dayKey, (amountsByDay.get(dayKey) || 0) + p.amount);
              });
            }
          });
        }
        const sortedRevenueDays = Array.from(amountsByDay.keys()).sort();
        const revenueFull = sortedRevenueDays.map(d => ({ date: d, amount: amountsByDay.get(d) }));
        setRevenueFullData(revenueFull);
        setRevenueChartData(revenueFull.slice(-7));
      } catch (err) {
        setBookingError('Lỗi khi tải dữ liệu booking');
        setTodayBookings(0);
        setTodayRevenue(0);
      } finally {
        setLoadingBookings(false);
        setLoadingRevenue(false);
      }
    };
    fetchBookings();
  }, [user]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };

  // revenueChartData và revenueFullData lấy từ API (state)

  const revenueByFieldType = [
    { name: 'Bóng đá', amount: 15000000 },
    { name: 'Cầu lông', amount: 8000000 },
    { name: 'Tennis', amount: 12000000 }
  ];

  return (
    <div className="ad-dashboard">
      {/* Stats Cards */}
      <div className="ad-dashboard__stats">
        <StatsCard
          title="Đặt sân hôm nay"
          value={loadingBookings ? '...' : todayBookings}
          icon={Calendar}
          change="+12% từ hôm qua"
          changeType="positive"
          color="blue"
        />
        <StatsCard
          title="Tổng người dùng"
          value={loadingUsers ? '...' : totalUsers}
          icon={Users}
          change="+8% từ tuần trước"
          changeType="positive"
          color="green"
        />
        <StatsCard
          title="Doanh thu"
          value={loadingRevenue ? '...' : formatCurrency(todayRevenue)}
          icon={TrendingUp}
          change="+15% từ hôm qua"
          changeType="positive"
          color="purple"
        />
        <StatsCard
          title="Tỷ lệ sử dụng sân"
          value={`${mockDashboardStats.utilizationRate}%`}
          icon={MapPin}
          change="-2% từ tuần trước"
          changeType="negative"
          color="yellow"
        />
      </div>

      {/* Charts Row */}
      <div className="ad-dashboard__charts">
        <Chart
          data={bookingChartData}
          type="bar"
          xDataKey="date"
          yDataKey="bookings"
          title="Xu hướng đặt sân"
          color="#3B82F6"
          showFilter={true}
          fullData={bookingFullData}
        />
        
        <Chart
          data={revenueChartData}
          type="line"
          xDataKey="date"
          yDataKey="amount"
          title="Biểu đồ doanh thu"
          color="#10B981"
          showFilter={true}
          fullData={revenueFullData}
        />
      </div>

      {/* Revenue by Field Type */}
      <div className="ad-dashboard__revenue-section">
        <div className="ad-dashboard__pie-chart">
          <Chart
            data={revenueByFieldType}
            type="pie"
            yDataKey="amount"
            title="Doanh thu theo loại sân"
          />
        </div>
        
        <div className="ad-dashboard__overview">
          <div className="ad-dashboard__overview-card">
            <h3 className="ad-dashboard__overview-title">
              Thông tin tổng quan tháng này
            </h3>
            <div className="ad-dashboard__overview-grid">
              <div className="ad-dashboard__metric ad-dashboard__metric--blue">
                <p className="ad-dashboard__metric-value">
                  {totalBookings}
                </p>
                <p className="ad-dashboard__metric-label">Tổng đặt sân</p>
              </div>
              <div className="ad-dashboard__metric ad-dashboard__metric--green">
                <p className="ad-dashboard__metric-value">
                  {formatCurrency(totalRevenue)}
                </p>
                <p className="ad-dashboard__metric-label">Tổng doanh thu</p>
              </div>
              <div className="ad-dashboard__metric ad-dashboard__metric--purple">
                <p className="ad-dashboard__metric-value">
                  {totalBookings > 0 ? formatCurrency(Math.round(totalRevenue / totalBookings)): 0}
                </p>
                <p className="ad-dashboard__metric-label">Giá trung bình/đặt sân</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
