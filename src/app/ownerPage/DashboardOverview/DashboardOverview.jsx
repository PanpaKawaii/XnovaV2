// DashboardOverview.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Activity,
  BarChart3,
  LineChart
} from 'lucide-react';
import { useTheme } from '../../hooks/ThemeContext';
import AnimatedCounter from '../../hooks/AnimatedCounter';
import './DashboardOverview.css';

function DashboardOverview({ data }) {
  const { isDark } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const overviewData = data || mockData;

  const getRevenueByPeriod = () => {
    switch (selectedPeriod) {
      case 'today': return overviewData.todayRevenue;
      case 'week': return overviewData.weekRevenue;
      case 'month': return overviewData.monthRevenue;
      default: return overviewData.monthRevenue;
    }
  };

  const getUsersByPeriod = () => {
    switch (selectedPeriod) {
      case 'today': return overviewData.dailyUsers;
      case 'week': return overviewData.weeklyUsers;
      case 'month': return overviewData.newUsers;
      default: return overviewData.newUsers;
    }
  };

  return (
    <div className={`dashboard-overview ${isDark ? 'dark' : 'light'}`}>
      <div className="header">
        <div>
          <h1 className="title">
            Dashboard Overview
          </h1>
          <p className="subtitle">
            Welcome back! Here's what's happening with your fields today.
          </p>
        </div>
        <div className="period-selector">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="select"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-content">
            <div>
              <p className="stat-label">
                Total Revenue
              </p>
              <p className="stat-value">
                $<AnimatedCounter value={getRevenueByPeriod()} />
              </p>
              <p className="stat-trend">
                <TrendingUp className="trend-icon" />
                +12% from last {selectedPeriod}
              </p>
            </div>
            <div className="stat-icon">
              <TrendingUp className="icon" />
            </div>
          </div>
        </div>

        <div className="stat-card users">
          <div className="stat-content">
            <div>
              <p className="stat-label">
                New Users
              </p>
              <p className="stat-value">
                <AnimatedCounter value={getUsersByPeriod()} />
              </p>
              <p className="stat-trend">
                <Users className="trend-icon" />
                This {selectedPeriod}
              </p>
            </div>
            <div className="stat-icon">
              <Users className="icon" />
            </div>
          </div>
        </div>

        <div className="stat-card bookings">
          <div className="stat-content">
            <div>
              <p className="stat-label">
                Total Bookings
              </p>
              <p className="stat-value">
                <AnimatedCounter value={overviewData.topFields.reduce((sum, field) => sum + field.bookings, 0)} />
              </p>
              <p className="stat-trend">
                <Calendar className="trend-icon" />
                Active bookings
              </p>
            </div>
            <div className="stat-icon">
              <Calendar className="icon" />
            </div>
          </div>
        </div>

        <div className="stat-card fields">
          <div className="stat-content">
            <div>
              <p className="stat-label">
                Active Fields
              </p>
              <p className="stat-value">
                <AnimatedCounter value={overviewData.topFields.filter(field => field.status === 'Active').length} />
              </p>
              <p className="stat-trend">
                <Activity className="trend-icon" />
                Available for booking
              </p>
            </div>
            <div className="stat-icon">
              <Activity className="icon" />
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">
              Monthly Revenue
            </h3>
            <BarChart3 className="chart-icon" />
          </div>
          <div className="chart-content">
            {overviewData.monthlyRevenue.map((revenue, index) => (
              <div key={index} className="bar-container">
                <div 
                  className="bar"
                  style={{ height: `${(revenue / Math.max(...overviewData.monthlyRevenue)) * 200}px` }}
                />
                <span className="bar-label">
                  ${(revenue / 1000).toFixed(0)}k
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">
              Daily Bookings
            </h3>
            <LineChart className="chart-icon" />
          </div>
          <div className="chart-content">
            {overviewData.dailyBookings.map((bookings, index) => (
              <div key={index} className="bar-container">
                <div 
                  className="bar"
                  style={{ height: `${(bookings / Math.max(...overviewData.dailyBookings)) * 200}px` }}
                />
                <span className="bar-label">
                  {bookings}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="top-fields-card">
        <h3 className="section-title">
          Top Performing Fields
        </h3>
        <div className="fields-grid">
          {overviewData.topFields.map((field) => (
            <div key={field.id} className="field-card">
              <div className="field-header">
                <h4 className="field-name">
                  {field.name}
                </h4>
                <span className={`field-status ${field.status.toLowerCase().replace(' ', '-')}`}>
                  {field.status}
                </span>
              </div>
              <p className="field-location">
                {field.location}
              </p>
              <div className="field-stats">
                <span className="field-bookings">
                  Bookings: {field.bookings}
                </span>
                <span className="field-revenue">
                  ${field.revenue.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

DashboardOverview.propTypes = {
  data: PropTypes.shape({
    totalRevenue: PropTypes.number,
    todayRevenue: PropTypes.number,
    weekRevenue: PropTypes.number,
    monthRevenue: PropTypes.number,
    newUsers: PropTypes.number,
    dailyUsers: PropTypes.number,
    weeklyUsers: PropTypes.number,
    topFields: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      location: PropTypes.string,
      status: PropTypes.oneOf(['Active', 'Under Maintenance', 'Hidden']),
      bookings: PropTypes.number,
      revenue: PropTypes.number,
      pricePerHour: PropTypes.number,
      description: PropTypes.string,
      image: PropTypes.string,
      isVisible: PropTypes.bool
    })),
    monthlyRevenue: PropTypes.arrayOf(PropTypes.number),
    dailyBookings: PropTypes.arrayOf(PropTypes.number),
    bookingActivity: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string,
      bookings: PropTypes.number,
      revenue: PropTypes.number
    }))
  })
};

// Mock data cho DashboardOverview
const mockData = {
  totalRevenue: 45680,
  todayRevenue: 1250,
  weekRevenue: 8900,
  monthRevenue: 45680,
  newUsers: 23,
  dailyUsers: 5,
  weeklyUsers: 23,
  topFields: [
    { id: '1', name: 'Premier Field A', location: 'Downtown', status: 'Active', bookings: 45, revenue: 8900, pricePerHour: 80, description: 'Professional grade field with LED lighting', isVisible: true },
    { id: '2', name: 'Champions Ground', location: 'Westside', status: 'Active', bookings: 38, revenue: 7200, pricePerHour: 75, description: 'Newly renovated with artificial turf', isVisible: true },
    { id: '3', name: 'Victory Stadium', location: 'Eastend', status: 'Active', bookings: 32, revenue: 6100, pricePerHour: 70, description: 'Traditional grass field with spectator seating', isVisible: true }
  ],
  monthlyRevenue: [32000, 38000, 35000, 42000, 45680, 48000],
  dailyBookings: [12, 15, 18, 22, 25, 28, 24],
  bookingActivity: [
    { date: '2024-01-01', bookings: 12, revenue: 1200 },
    { date: '2024-01-02', bookings: 15, revenue: 1500 },
    { date: '2024-01-03', bookings: 18, revenue: 1800 },
    { date: '2024-01-04', bookings: 22, revenue: 2200 },
    { date: '2024-01-05', bookings: 25, revenue: 2500 },
    { date: '2024-01-06', bookings: 28, revenue: 2800 },
    { date: '2024-01-07', bookings: 24, revenue: 2400 }
  ]
};

export default DashboardOverview;