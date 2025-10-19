import React, { useState } from 'react';
import { Download, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { Chart } from '../../components/admincomponents/Dashboard/Chart';
import { Button } from '../../components/admincomponents/UI/Button';
import { FilterSelect } from '../../components/admincomponents/UI/FilterSelect';
import './RevenueAnalytics.css';

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
  todayRevenue: 1200000,
  weekRevenue: 8500000,
  monthRevenue: 35000000,
  monthBookings: 180
};

export const RevenueAnalytics = () => {
  const [timeFilter, setTimeFilter] = useState('week');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };

  const timeOptions = [
    { value: 'week', label: 'Tuần này' },
    { value: 'month', label: 'Tháng này' },
    { value: 'quarter', label: 'Quý này' },
    { value: 'year', label: 'Năm này' }
  ];

  const revenueByFieldType = [
    { name: 'Bóng đá', amount: 15000000 },
    { name: 'Cầu lông', amount: 8000000 },
    { name: 'Tennis', amount: 12000000 }
  ];

  const recentTransactions = [
    { id: 'TXN001', amount: 200000, date: '2024-12-15', status: 'completed', user: 'Nguyễn Văn An' },
    { id: 'TXN002', amount: 150000, date: '2024-12-15', status: 'completed', user: 'Trần Thị Bình' },
    { id: 'TXN003', amount: 300000, date: '2024-12-14', status: 'pending', user: 'Lê Minh Cường' },
    { id: 'TXN004', amount: 120000, date: '2024-12-14', status: 'failed', user: 'Phạm Thu Hà' },
    { id: 'TXN005', amount: 180000, date: '2024-12-13', status: 'completed', user: 'Võ Đình Nam' }
  ];

  return (
    <div className="ad-revenue-page">
      {/* Header */}
      <div className="ad-revenue-page__header">
        <h1 className="ad-revenue-page__title">
          Thống kê doanh thu
        </h1>
        <div className="ad-revenue-page__header-actions">
          <FilterSelect
            options={timeOptions}
            value={timeFilter}
            onChange={setTimeFilter}
            placeholder="Chọn khoảng thời gian"
          />
          <Button variant="primary" icon={Download}>
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="ad-revenue-page__stats">
        <div className="ad-revenue-stat-card ad-revenue-stat-card--blue">
          <div className="ad-revenue-stat-card__content">
            <p className="ad-revenue-stat-card__label">Doanh thu hôm nay</p>
            <p className="ad-revenue-stat-card__value">
              {formatCurrency(mockDashboardStats.todayRevenue)}
            </p>
            <p className="ad-revenue-stat-card__change ad-revenue-stat-card__change--positive">
              +12% từ hôm qua
            </p>
          </div>
          <div className="ad-revenue-stat-card__icon">
            <DollarSign className="ad-revenue-stat-card__icon-svg" />
          </div>
        </div>

        <div className="ad-revenue-stat-card ad-revenue-stat-card--green">
          <div className="ad-revenue-stat-card__content">
            <p className="ad-revenue-stat-card__label">Doanh thu tuần</p>
            <p className="ad-revenue-stat-card__value">
              {formatCurrency(mockDashboardStats.weekRevenue)}
            </p>
            <p className="ad-revenue-stat-card__change ad-revenue-stat-card__change--positive">
              +8% từ tuần trước
            </p>
          </div>
          <div className="ad-revenue-stat-card__icon">
            <TrendingUp className="ad-revenue-stat-card__icon-svg" />
          </div>
        </div>

        <div className="ad-revenue-stat-card ad-revenue-stat-card--purple">
          <div className="ad-revenue-stat-card__content">
            <p className="ad-revenue-stat-card__label">Doanh thu tháng</p>
            <p className="ad-revenue-stat-card__value">
              {formatCurrency(mockDashboardStats.monthRevenue)}
            </p>
            <p className="ad-revenue-stat-card__change ad-revenue-stat-card__change--positive">
              +15% từ tháng trước
            </p>
          </div>
          <div className="ad-revenue-stat-card__icon">
            <Calendar className="ad-revenue-stat-card__icon-svg" />
          </div>
        </div>

        <div className="ad-revenue-stat-card ad-revenue-stat-card--yellow">
          <div className="ad-revenue-stat-card__content">
            <p className="ad-revenue-stat-card__label">Doanh thu TB/đặt sân</p>
            <p className="ad-revenue-stat-card__value">
              {formatCurrency(Math.round(mockDashboardStats.monthRevenue / mockDashboardStats.monthBookings))}
            </p>
            <p className="ad-revenue-stat-card__change ad-revenue-stat-card__change--neutral">
              ~0% từ tháng trước
            </p>
          </div>
          <div className="ad-revenue-stat-card__icon">
            <TrendingUp className="ad-revenue-stat-card__icon-svg" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="ad-revenue-page__charts">
        <Chart
          data={mockRevenueData.map(item => ({
            date: new Date(item.date).toLocaleDateString('vi-VN'),
            amount: item.amount
          }))}
          type="line"
          xDataKey="date"
          yDataKey="amount"
          title="Xu hướng doanh thu theo ngày"
          color="#10B981"
        />
        
        <Chart
          data={revenueByFieldType}
          type="pie"
          yDataKey="amount"
          title="Phân bổ doanh thu theo loại sân"
        />
      </div>

      {/* Recent Transactions */}
      <div className="ad-revenue-transactions">
        <div className="ad-revenue-transactions__header">
          <h3 className="ad-revenue-transactions__title">
            Giao dịch gần đây
          </h3>
        </div>
        <div className="ad-revenue-transactions__table-wrapper">
          <table className="ad-revenue-transactions__table">
            <thead className="ad-revenue-transactions__thead">
              <tr>
                <th className="ad-revenue-transactions__th">ID Giao dịch</th>
                <th className="ad-revenue-transactions__th">Người dùng</th>
                <th className="ad-revenue-transactions__th">Số tiền</th>
                <th className="ad-revenue-transactions__th">Ngày</th>
                <th className="ad-revenue-transactions__th">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="ad-revenue-transactions__tbody">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="ad-revenue-transactions__row">
                  <td className="ad-revenue-transactions__td ad-revenue-transactions__td--id">
                    {transaction.id}
                  </td>
                  <td className="ad-revenue-transactions__td">
                    {transaction.user}
                  </td>
                  <td className="ad-revenue-transactions__td ad-revenue-transactions__td--amount">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="ad-revenue-transactions__td">
                    {new Date(transaction.date).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="ad-revenue-transactions__td">
                    <span className={`ad-revenue-transactions__badge ad-revenue-transactions__badge--${transaction.status}`}>
                      {transaction.status === 'completed' ? 'Hoàn thành' : 
                       transaction.status === 'pending' ? 'Đang xử lý' : 'Thất bại'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
