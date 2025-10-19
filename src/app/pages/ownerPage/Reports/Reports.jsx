import React, { useState } from 'react';
import {
  Download,
  BarChart,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Activity,
  FileText,
} from 'lucide-react';
import { useTheme } from '../../../hooks/ThemeContext';
import './ReportsCSS.css';

const mockData = {
  totalRevenue: 45680,
  todayRevenue: 1250,
  weekRevenue: 8900,
  monthRevenue: 45680,
  newUsers: 96,
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
      isVisible: true,
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
      isVisible: true,
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
      isVisible: true,
    },
  ],
  monthlyRevenue: [32000, 38000, 35000, 42000, 45680, 48000],
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  dailyBookings: [12, 15, 18, 22, 25, 28, 24],
  bookingActivity: [
    { date: '2024-01-01', bookings: 12, revenue: 1200 },
    { date: '2024-01-02', bookings: 15, revenue: 1500 },
    { date: '2024-01-03', bookings: 18, revenue: 1800 },
    { date: '2024-01-04', bookings: 22, revenue: 2200 },
    { date: '2024-01-05', bookings: 25, revenue: 2500 },
    { date: '2024-01-06', bookings: 28, revenue: 2800 },
    { date: '2024-01-07', bookings: 24, revenue: 2400 },
  ],
};

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('revenue');
  const [dateRange, setDateRange] = useState('month');

  const exportReport = (format) => {
    console.log(`Exporting ${selectedReport} report as ${format}`);
  };

  const reportTypes = [
    { id: 'revenue', name: 'Revenue Report', icon: DollarSign, color: 'revenue' },
    { id: 'bookings', name: 'Booking Report', icon: Calendar, color: 'bookings' },
    { id: 'users', name: 'User Report', icon: Users, color: 'users' },
    { id: 'performance', name: 'Performance Report', icon: Activity, color: 'performance' },
  ];

  return (
    <div className="reports">
      <div className="reports-header">
        <div className="reports-header-left">
          <h1 className="reports-title">Reports & Analytics</h1>
          <p className="reports-description">
            Generate detailed reports and analyze your business performance.
          </p>
        </div>
        <div className="export-buttons">
          <button onClick={() => exportReport('csv')} className="export-csv">
            <Download className="icon-small" />
            Export CSV
          </button>
          <button onClick={() => exportReport('pdf')} className="export-pdf">
            <FileText className="icon-small" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="report-types">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`report-type-card report-type-${report.id} ${
                selectedReport === report.id ? 'selected' : ''
              }`}
            >
              <div className={`icon-container ${report.id}-icon-bg`}>
                <Icon className={`icon-card ${report.id}-icon-color`} />
              </div>
              <h3 className="card-title">{report.name}</h3>
              <p className="card-description">Detailed analysis and insights</p>
            </button>
          );
        })}
      </div>

      <div className="date-range-filter">
        <div className="date-range-header">
          <h3 className="date-range-title">Date Range</h3>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="date-range-select"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      <div className="report-content">
        <div className="revenue-chart">
          <div className="chart-header">
            <h3 className="chart-title">Revenue Trend</h3>
            <BarChart className="chart-icon" />
          </div>
          <div className="chart-body">
            {mockData.monthlyRevenue.map((revenue, index) => (
              <div key={index} className="bar-container">
                <div
                  className="bar"
                  style={{ height: `${(revenue / Math.max(...mockData.monthlyRevenue)) * 200}px` }}
                  title={`$${revenue.toLocaleString()} in ${mockData.months[index]}`}
                >
                  <span className="bar-tooltip">${revenue.toLocaleString()}</span>
                </div>
                <span className="bar-label">{mockData.months[index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="booking-activity">
          <div className="activity-header">
            <h3 className="activity-title">Booking Activity</h3>
            <TrendingUp className="activity-icon" />
          </div>
          <div className="activity-list">
            {mockData.bookingActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-date">
                  <div className="dot"></div>
                  <span>{new Date(activity.date).toLocaleDateString()}</span>
                </div>
                <div className="activity-stats">
                  <span className="bookings-count">{activity.bookings} bookings</span>
                  <span className="revenue-amount">${activity.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="summary-stats">
        <div className="stat-card revenue-stat">
          <div className="stat-content">
            <div>
              <p className="stat-label">Total Revenue</p>
              <p className="stat-value">${mockData.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="stat-icon" />
          </div>
        </div>

        <div className="stat-card bookings-stat">
          <div className="stat-content">
            <div>
              <p className="stat-label">Total Bookings</p>
              <p className="stat-value">
                {mockData.topFields.reduce((sum, field) => sum + field.bookings, 0)}
              </p>
            </div>
            <Calendar className="stat-icon" />
          </div>
        </div>

        <div className="stat-card users-stat">
          <div className="stat-content">
            <div>
              <p className="stat-label">New Users</p>
              <p className="stat-value">{mockData.newUsers}</p>
            </div>
            <Users className="stat-icon" />
          </div>
        </div>

        <div className="stat-card fields-stat">
          <div className="stat-content">
            <div>
              <p className="stat-label">Active Fields</p>
              <p className="stat-value">
                {mockData.topFields.filter((field) => field.status === 'Active').length}
              </p>
            </div>
            <Activity className="stat-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;