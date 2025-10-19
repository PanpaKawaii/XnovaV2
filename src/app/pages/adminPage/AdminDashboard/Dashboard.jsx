import React from 'react';
import { Calendar, Users, MapPin, TrendingUp } from 'lucide-react';
import { StatsCard } from '../../../components/admincomponents/Dashboard/StatsCard';
import { Chart } from '../../../components/admincomponents/Dashboard/Chart';
import './Dashboard.css';

// Inlined data
const mockRevenueData = [
  { date: '2024-12-01', amount: 2400000, bookings: 15 },
  { date: '2024-12-02', amount: 1800000, bookings: 12 },
  { date: '2024-12-03', amount: 3200000, bookings: 20 },
  { date: '2024-12-04', amount: 2800000, bookings: 18 },
  { date: '2024-12-05', amount: 3600000, bookings: 22 },
  { date: '2024-12-06', amount: 4200000, bookings: 25 },
  { date: '2024-12-07', amount: 3800000, bookings: 23 },
];

const mockDashboardStats = {
  todayBookings: 8,
  weekBookings: 45,
  monthBookings: 180,
  todayRevenue: 1200000,
  weekRevenue: 8500000,
  monthRevenue: 35000000,
  newUsers: 12,
  utilizationRate: 68
};

export const Dashboard = () => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };

  const bookingChartData = mockRevenueData.map(item => ({
    date: new Date(item.date).toLocaleDateString('vi-VN'),
    bookings: item.bookings
  }));

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
          value={mockDashboardStats.todayBookings}
          icon={Calendar}
          change="+12% từ hôm qua"
          changeType="positive"
          color="blue"
        />
        <StatsCard
          title="Người dùng mới"
          value={mockDashboardStats.newUsers}
          icon={Users}
          change="+8% từ tuần trước"
          changeType="positive"
          color="green"
        />
        <StatsCard
          title="Doanh thu"
          value={formatCurrency(mockDashboardStats.todayRevenue)}
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
        />
        
        <Chart
          data={mockRevenueData.map(item => ({
            date: new Date(item.date).toLocaleDateString('vi-VN'),
            amount: item.amount
          }))}
          type="line"
          xDataKey="date"
          yDataKey="amount"
          title="Biểu đồ doanh thu"
          color="#10B981"
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
                  {mockDashboardStats.monthBookings}
                </p>
                <p className="ad-dashboard__metric-label">Tổng đặt sân</p>
              </div>
              <div className="ad-dashboard__metric ad-dashboard__metric--green">
                <p className="ad-dashboard__metric-value">
                  {formatCurrency(mockDashboardStats.monthRevenue)}
                </p>
                <p className="ad-dashboard__metric-label">Tổng doanh thu</p>
              </div>
              <div className="ad-dashboard__metric ad-dashboard__metric--purple">
                <p className="ad-dashboard__metric-value">
                  {Math.round(mockDashboardStats.monthRevenue / mockDashboardStats.monthBookings)}
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
