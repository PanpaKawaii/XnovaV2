import React, { useState } from 'react';
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

const mockData = {
  totalRevenue: 45680,
  todayRevenue: 1250,
  weekRevenue: 8900,
  monthRevenue: 45680,
  newUsers: 23,
  dailyUsers: 5,
  weeklyUsers: 23,
  topFields: [
    {
      id: '1',
      name: 'Premier Field A',
      location: 'Downtown',
      status: 'Active',
      bookings: 45,
      revenue: 8900,
      pricePerHour: 80,
      description: 'Professional grade field with LED lighting',
      isVisible: true
    },
    {
      id: '2',
      name: 'Champions Ground',
      location: 'Westside',
      status: 'Active',
      bookings: 38,
      revenue: 7200,
      pricePerHour: 75,
      description: 'Newly renovated with artificial turf',
      isVisible: true
    },
    {
      id: '3',
      name: 'Victory Stadium',
      location: 'Eastend',
      status: 'Active',
      bookings: 32,
      revenue: 6100,
      pricePerHour: 70,
      description: 'Traditional grass field with spectator seating',
      isVisible: true
    }
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

const DashboardOverview = () => {
  const { isDark } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const data = mockData;

  const getRevenueByPeriod = () => {
    switch (selectedPeriod) {
      case 'today':
        return data.todayRevenue;
      case 'week':
        return data.weekRevenue;
      case 'month':
        return data.monthRevenue;
      default:
        return data.monthRevenue;
    }
  };

  const getUsersByPeriod = () => {
    switch (selectedPeriod) {
      case 'today':
        return data.dailyUsers;
      case 'week':
        return data.weeklyUsers;
      case 'month':
        return data.newUsers;
      default:
        return data.newUsers;
    }
  };

  return (
    <div className="dashboard-overview">
      <div className="header-section">
        <div className="title-container">
          <h1 className="title">Dashboard Overview</h1>
          <p className="subtitle">Welcome back! Here's what's happening with your fields today.</p>
        </div>
        <div className="period-selector">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stats-card revenue-card">
          <div className="card-content">
            <div className="info">
              <p className="label">Total Revenue</p>
              <p className="value">$<AnimatedCounter value={getRevenueByPeriod()} /></p>
              <p className="trend">
                <TrendingUp className="trend-icon" />
                +12% from last {selectedPeriod}
              </p>
            </div>
            <div className="icon-wrapper">
              <TrendingUp className="icon" />
            </div>
          </div>
        </div>

        <div className="stats-card users-card">
          <div className="card-content">
            <div className="info">
              <p className="label">New Users</p>
              <p className="value"><AnimatedCounter value={getUsersByPeriod()} /></p>
              <p className="trend">
                <Users className="trend-icon" />
                This {selectedPeriod}
              </p>
            </div>
            <div className="icon-wrapper">
              <Users className="icon" />
            </div>
          </div>
        </div>

        <div className="stats-card bookings-card">
          <div className="card-content">
            <div className="info">
              <p className="label">Total Bookings</p>
              <p className="value"><AnimatedCounter value={data.topFields.reduce((sum, field) => sum + field.bookings, 0)} /></p>
              <p className="trend">
                <Calendar className="trend-icon" />
                Active bookings
              </p>
            </div>
            <div className="icon-wrapper">
              <Calendar className="icon" />
            </div>
          </div>
        </div>

        <div className="stats-card fields-card">
          <div className="card-content">
            <div className="info">
              <p className="label">Active Fields</p>
              <p className="value"><AnimatedCounter value={data.topFields.filter(field => field.status === 'Active').length} /></p>
              <p className="trend">
                <Activity className="trend-icon" />
                Available for booking
              </p>
            </div>
            <div className="icon-wrapper">
              <Activity className="icon" />
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card revenue-chart">
          <div className="chart-header">
            <h3 className="chart-title">Monthly Revenue</h3>
            <BarChart3 className="chart-icon" />
          </div>
          <div className="chart-container">
            {data.monthlyRevenue.map((revenue, index) => {
              const max = Math.max(...data.monthlyRevenue);
              return (
                <div key={index} className="bar revenue-bar">
                  <div 
                    className="bar-fill"
                    style={{ height: `${(revenue / max) * 200}px` }}
                  />
                  <span className="bar-label">${(revenue / 1000).toFixed(0)}k</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="chart-card bookings-chart">
          <div className="chart-header">
            <h3 className="chart-title">Daily Bookings</h3>
            <LineChart className="chart-icon" />
          </div>
          <div className="chart-container">
            {data.dailyBookings.map((bookings, index) => {
              const max = Math.max(...data.dailyBookings);
              return (
                <div key={index} className="bar bookings-bar">
                  <div 
                    className="bar-fill"
                    style={{ height: `${(bookings / max) * 200}px` }}
                  />
                  <span className="bar-label">{bookings}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="top-fields-card">
        <h3 className="section-title">Top Performing Fields</h3>
        <div className="fields-grid">
          {data.topFields.map((field) => (
            <div key={field.id} className="field-card">
              <div className="field-header">
                <h4 className="field-name">{field.name}</h4>
                <span className={`status ${field.status.toLowerCase().replace(' ', '-')}`}>
                  {field.status}
                </span>
              </div>
              <p className="location">{field.location}</p>
              <div className="field-stats">
                <span className="stat-label">Bookings: {field.bookings}</span>
                <span className="stat-value">${field.revenue.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;