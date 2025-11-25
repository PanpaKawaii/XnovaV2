import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Activity,
  BarChart3,
  LineChart
} from 'lucide-react';
import { useTheme } from '../../../hooks/ThemeContext';
import { useAuth } from '../../../hooks/AuthContext/AuthContext';
import AnimatedCounter from '../../../hooks/AnimatedCounter';
import { fetchData } from '../../../../mocks/CallingAPI.js';
import './DashboardOverview.css';

const DashboardOverview = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  // States for data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [fields, setFields] = useState([]);
  const [venues, setVenues] = useState([]);
  const [slots, setSlots] = useState([]);
  
  // States for computed data
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [weekRevenue, setWeekRevenue] = useState(0);
  const [monthRevenue, setMonthRevenue] = useState(0);
  const [dailyUsers, setDailyUsers] = useState(0);
  const [weeklyUsers, setWeeklyUsers] = useState(0);
  const [monthlyUsers, setMonthlyUsers] = useState(0);
  const [topFields, setTopFields] = useState([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [dailyBookingsData, setDailyBookingsData] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = user?.token;
        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch all data in parallel
        const [bookingsData, fieldsData, venuesData, slotsData] = await Promise.all([
          fetchData('booking', token).catch(() => []),
          fetchData('field', token).catch(() => []),
          fetchData('venue', token).catch(() => []),
          fetchData('slot', token).catch(() => [])
        ]);

        // Normalize data to arrays
        const normalizedBookings = Array.isArray(bookingsData) ? bookingsData : [];
        const normalizedFields = Array.isArray(fieldsData) ? fieldsData : [];
        const normalizedVenues = Array.isArray(venuesData) ? venuesData : [];
        const normalizedSlots = Array.isArray(slotsData) ? slotsData : [];

        // Filter owner's data
        const ownerVenues = normalizedVenues.filter(v => v.userId === user.id);
        const ownerVenueIds = ownerVenues.map(v => v.id);
        const ownerFields = normalizedFields.filter(f => ownerVenueIds.includes(f.venueId));
        const ownerFieldIds = ownerFields.map(f => f.id);
        const ownerSlots = normalizedSlots.filter(s => ownerFieldIds.includes(s.fieldId));
        const ownerSlotIds = ownerSlots.map(s => s.id);
        
        // Filter bookings for owner's fields
        const ownerBookings = normalizedBookings.filter(b => 
          ownerFieldIds.includes(b.fieldId)
        );

        setBookings(ownerBookings);
        setFields(ownerFields);
        setVenues(ownerVenues);
        setSlots(ownerSlots);

        // Calculate revenue and users statistics
        calculateStatistics(ownerBookings, ownerFields);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user]);

  const calculateStatistics = (bookingsData, fieldsData) => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    
    // Calculate start of week (Monday)
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Calculate start of month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let todayRev = 0, weekRev = 0, monthRev = 0;
    let todayUsersSet = new Set(), weekUsersSet = new Set(), monthUsersSet = new Set();

    // Calculate revenue and unique users
    bookingsData.forEach(booking => {
      const bookingDate = new Date(booking.date);
      const bookingDateStr = booking.date?.slice(0, 10);
      
      // Calculate revenue from payments
      let bookingRevenue = 0;
      if (Array.isArray(booking.payments)) {
        booking.payments.forEach(payment => {
          if (typeof payment.amount === 'number') {
            bookingRevenue += payment.amount;
          }
        });
      }

      // Today
      if (bookingDateStr === todayStr) {
        todayRev += bookingRevenue;
        todayUsersSet.add(booking.userId);
      }

      // This week
      if (bookingDate >= startOfWeek) {
        weekRev += bookingRevenue;
        weekUsersSet.add(booking.userId);
      }

      // This month
      if (bookingDate >= startOfMonth) {
        monthRev += bookingRevenue;
        monthUsersSet.add(booking.userId);
      }
    });

    setTodayRevenue(todayRev);
    setWeekRevenue(weekRev);
    setMonthRevenue(monthRev);
    setDailyUsers(todayUsersSet.size);
    setWeeklyUsers(weekUsersSet.size);
    setMonthlyUsers(monthUsersSet.size);

    // Calculate top fields
    const fieldStats = {};
    fieldsData.forEach(field => {
      fieldStats[field.id] = {
        ...field,
        bookings: 0,
        revenue: 0,
        status: field.status === 1 ? 'Active' : 'Inactive'
      };
    });

    bookingsData.forEach(booking => {
      if (fieldStats[booking.fieldId]) {
        fieldStats[booking.fieldId].bookings++;
        
        if (Array.isArray(booking.payments)) {
          booking.payments.forEach(payment => {
            if (typeof payment.amount === 'number') {
              fieldStats[booking.fieldId].revenue += payment.amount;
            }
          });
        }
      }
    });

    const topFieldsArray = Object.values(fieldStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);

    setTopFields(topFieldsArray);

    // Calculate monthly revenue for last 6 months
    const monthlyRev = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
      
      let monthTotal = 0;
      bookingsData.forEach(booking => {
        const bookingDate = new Date(booking.date);
        if (bookingDate >= monthStart && bookingDate <= monthEnd) {
          if (Array.isArray(booking.payments)) {
            booking.payments.forEach(payment => {
              if (typeof payment.amount === 'number') {
                monthTotal += payment.amount;
              }
            });
          }
        }
      });
      monthlyRev.push(monthTotal);
    }
    setMonthlyRevenueData(monthlyRev);

    // Calculate daily bookings for last 7 days
    const dailyBookings = [];
    for (let i = 6; i >= 0; i--) {
      const dayDate = new Date(now);
      dayDate.setDate(dayDate.getDate() - i);
      const dayStr = dayDate.toISOString().slice(0, 10);
      
      const dayCount = bookingsData.filter(b => b.date?.slice(0, 10) === dayStr).length;
      dailyBookings.push(dayCount);
    }
    setDailyBookingsData(dailyBookings);
  };

  const data = {
    totalRevenue: monthRevenue,
    todayRevenue: todayRevenue,
    weekRevenue: weekRevenue,
    monthRevenue: monthRevenue,
    newUsers: monthlyUsers,
    dailyUsers: dailyUsers,
    weeklyUsers: weeklyUsers,
    topFields: topFields,
    monthlyRevenue: monthlyRevenueData,
    dailyBookings: dailyBookingsData
  };

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
      {loading && (
        <div className="reports-loading">Đang tải dữ liệu...</div>
      )}
      
      {error && (
        <div className="reports-error">Lỗi: {error}</div>
      )}
      
      {!loading && !error && (
        <>
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
                  <p className="value">
                    <AnimatedCounter value={getRevenueByPeriod()} />đ
                  </p>
                  <p className="trend">
                    <TrendingUp className="trend-icon" />
                    {selectedPeriod === 'today' ? 'Hôm nay' : selectedPeriod === 'week' ? 'Tuần này' : 'Tháng này'}
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
                    {selectedPeriod === 'today' ? 'Hôm nay' : selectedPeriod === 'week' ? 'Tuần này' : 'Tháng này'}
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
                  <p className="label">Active Venues</p>
                  <p className="value">
                    <AnimatedCounter value={venues.filter(venue => venue.status === 1).length} />
                    /{venues.length}
                  </p>
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
                  const max = Math.max(...data.monthlyRevenue, 1);
                  return (
                    <div key={index} className="bar revenue-bar">
                      <div 
                        className="bar-fill"
                        style={{ height: `${(revenue / max) * 200}px` }}
                      />
                      <span className="bar-label">{(revenue / 1000).toFixed(0)}k</span>
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
                  const max = Math.max(...data.dailyBookings, 1);
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
              {data.topFields.length > 0 ? (
                data.topFields.map((field) => (
                  <div key={field.id} className="field-card">
                    <div className="field-header">
                      <h4 className="field-name">{field.name}</h4>
                      <span className={`status ${field.status.toLowerCase().replace(' ', '-')}`}>
                        {field.status}
                      </span>
                    </div>
                    <p className="location">{field.description || 'No description'}</p>
                    <div className="field-stats">
                      <span className="stat-label">Bookings: {field.bookings}</span>
                      <span className="stat-value">{field.revenue.toLocaleString()}đ</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-fields">
                  <p>Chưa có dữ liệu sân</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardOverview;