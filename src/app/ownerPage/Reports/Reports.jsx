// Reports.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Download, 
  Upload, 
  BarChart3, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Users,
  Activity,
  FileText,
  PieChart
} from 'lucide-react';
import { useTheme } from '../../hooks/ThemeContext';
import './Reports.css';

function Reports({ data }) {
  const { isDark } = useTheme();
  const [selectedReport, setSelectedReport] = useState('revenue');
  const [dateRange, setDateRange] = useState('month');

  const exportReport = (format) => {
    console.log(`Exporting ${selectedReport} report as ${format}`);
  };

  const reportTypes = [
    { id: 'revenue', name: 'Revenue Report', icon: DollarSign, color: 'revenue' },
    { id: 'bookings', name: 'Booking Report', icon: Calendar, color: 'bookings' },
    { id: 'users', name: 'User Report', icon: Users, color: 'users' },
    { id: 'performance', name: 'Performance Report', icon: Activity, color: 'performance' }
  ];

  const reportData = data || mockData;

  return (
    <div className={`reports ${isDark ? 'dark' : 'light'}`}>
      <div className="header">
        <div>
          <h1 className="title">
            Reports & Analytics
          </h1>
          <p className="subtitle">
            Generate detailed reports and analyze your business performance.
          </p>
        </div>
        <div className="export-buttons">
          <button
            onClick={() => exportReport('csv')}
            className="export-btn csv"
          >
            <Download className="icon" />
            Export CSV
          </button>
          <button
            onClick={() => exportReport('pdf')}
            className="export-btn pdf"
          >
            <FileText className="icon" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="report-types-grid">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`report-type-card ${report.color} ${selectedReport === report.id ? 'selected' : ''}`}
            >
              <div className="report-icon-container">
                <Icon className="report-icon" />
              </div>
              <h3 className="report-name">
                {report.name}
              </h3>
              <p className="report-desc">
                Detailed analysis and insights
              </p>
            </button>
          );
        })}
      </div>

      <div className="date-range-card">
        <div className="date-range-header">
          <h3 className="date-range-title">
            Date Range
          </h3>
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

      <div className="report-content-grid">
        <div className="chart-card revenue-trend">
          <div className="chart-header">
            <h3 className="chart-title">
              Revenue Trend
            </h3>
            <BarChart3 className="chart-icon" />
          </div>
          <div className="chart-content">
            {reportData.monthlyRevenue.map((revenue, index) => (
              <div key={index} className="bar-container">
                <div 
                  className="bar"
                  style={{ height: `${(revenue / Math.max(...reportData.monthlyRevenue)) * 200}px` }}
                />
                <span className="bar-label">
                  ${(revenue / 1000).toFixed(0)}k
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card booking-activity">
          <div className="chart-header">
            <h3 className="chart-title">
              Booking Activity
            </h3>
            <TrendingUp className="chart-icon" />
          </div>
          <div className="activity-list">
            {reportData.bookingActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-date">
                  <div className="dot"></div>
                  <span>
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="activity-stats">
                  <span className="bookings">
                    {activity.bookings} bookings
                  </span>
                  <span className="revenue">
                    ${activity.revenue}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="summary-stats-grid">
        <div className="stat-card revenue">
          <div className="stat-content">
            <div>
              <p className="stat-label">
                Total Revenue
              </p>
              <p className="stat-value">
                ${reportData.totalRevenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="stat-icon" />
          </div>
        </div>

        <div className="stat-card bookings">
          <div className="stat-content">
            <div>
              <p className="stat-label">
                Total Bookings
              </p>
              <p className="stat-value">
                {reportData.topFields.reduce((sum, field) => sum + field.bookings, 0)}
              </p>
            </div>
            <Calendar className="stat-icon" />
          </div>
        </div>

        <div className="stat-card users">
          <div className="stat-content">
            <div>
              <p className="stat-label">
                New Users
              </p>
              <p className="stat-value">
                {reportData.newUsers}
              </p>
            </div>
            <Users className="stat-icon" />
          </div>
        </div>

        <div className="stat-card fields">
          <div className="stat-content">
            <div>
              <p className="stat-label">
                Active Fields
              </p>
              <p className="stat-value">
                {reportData.topFields.filter(field => field.status === 'Active').length}
              </p>
            </div>
            <Activity className="stat-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

Reports.propTypes = {
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

// Mock data cho Reports
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

export default Reports;