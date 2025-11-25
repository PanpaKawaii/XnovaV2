import React, { useState, useEffect, useMemo } from 'react';
import {
  Download,
  BarChart,
  TrendingUp,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../../hooks/AuthContext/AuthContext';
import { fetchData } from '../../../../mocks/CallingAPI';
import './ReportsCSS.css';

const Reports = () => {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState('revenue');
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Data States
  const [bookings, setBookings] = useState([]);
  const [bookingSlots, setBookingSlots] = useState([]);
  const [payments, setPayments] = useState([]);
  const [venues, setVenues] = useState([]);
  const [fields, setFields] = useState([]);
  const [slots, setSlots] = useState([]);

  // Fetch all data from APIs
  useEffect(() => {
    const fetchAllData = async () => {
      if (!user?.token) return;

      setLoading(true);
      setError(null);

      try {
        const token = user.token;

        const [
          bookingsData,
          paymentsData,
          venuesData,
          fieldsData,
          slotsData,
        ] = await Promise.all([
          fetchData('Booking', token).catch(() => []),
          fetchData('Payment', token).catch(() => []),
          fetchData('Venue', token).catch(() => []),
          fetchData('Field', token).catch(() => []),
          fetchData('Slot', token).catch(() => []),
        ]);

        // Normalize data to arrays
        const normalizeArray = (data) => Array.isArray(data) ? data : (data ? [data] : []);

        const normalizedBookings = normalizeArray(bookingsData);
        const normalizedPayments = normalizeArray(paymentsData);
        const normalizedVenues = normalizeArray(venuesData);
        const normalizedFields = normalizeArray(fieldsData);
        const normalizedSlots = normalizeArray(slotsData);

        // Extract booking slots from bookings
        const allBookingSlots = normalizedBookings.flatMap(booking =>
          (booking.bookingSlots || []).map(bs => ({
            ...bs,
            bookingId: booking.id,
            slotId: bs.slotId,
          }))
        );

        // Filter data by owner (only venues and fields owned by current user)
        const ownerVenues = normalizedVenues.filter(v => 
          v.userId === user.id || v.ownerId === user.id || v.ownerUserId === user.id
        );
        const ownerVenueIds = new Set(ownerVenues.map(v => v.id));
        const ownerFields = normalizedFields.filter(f => ownerVenueIds.has(f.venueId));
        const ownerFieldIds = new Set(ownerFields.map(f => f.id));
        const ownerBookings = normalizedBookings.filter(b => ownerFieldIds.has(b.fieldId));

        setBookings(ownerBookings);
        setBookingSlots(allBookingSlots);
        setPayments(normalizedPayments);
        setVenues(ownerVenues);
        setFields(ownerFields);
        setSlots(normalizedSlots);
      } catch (err) {
        console.error('Error fetching reports data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user]);

  // Calculate date ranges
  const getDateRange = (range) => {
    const today = new Date();
    const startDate = new Date();

    switch (range) {
      case 'week':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(today.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(today.getMonth() - 1);
    }

    return { startDate, endDate: today };
  };

  // Filter bookings by date range
  const filteredBookings = useMemo(() => {
    const { startDate, endDate } = getDateRange(dateRange);
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date || booking.currentDate);
      return bookingDate >= startDate && bookingDate <= endDate;
    });
  }, [bookings, dateRange]);

  // Calculate revenue data
  const revenueData = useMemo(() => {
    const slotMap = new Map(slots.map(s => [s.id, s]));
    const paymentMap = new Map();
    
    // Group payments by booking
    payments.forEach(payment => {
      if (!paymentMap.has(payment.bookingId)) {
        paymentMap.set(payment.bookingId, []);
      }
      paymentMap.get(payment.bookingId).push(payment);
    });

    let totalRevenue = 0;
    let confirmedRevenue = 0;
    let pendingRevenue = 0;
    const dailyRevenue = {};
    const fieldRevenue = {};

    filteredBookings.forEach(booking => {
      const bookingSlotsList = bookingSlots.filter(bs => bs.bookingId === booking.id);
      const slotRevenue = bookingSlotsList.reduce((sum, bs) => {
        const slot = slotMap.get(bs.slotId);
        return sum + (slot?.price || 0);
      }, 0);

      totalRevenue += slotRevenue;

      // Categorize by booking status
      if (booking.status === 1 || booking.status === 4) {
        confirmedRevenue += slotRevenue;
      } else {
        pendingRevenue += slotRevenue;
      }

      // Group by date
      const dateKey = new Date(booking.date || booking.currentDate).toISOString().split('T')[0];
      dailyRevenue[dateKey] = (dailyRevenue[dateKey] || 0) + slotRevenue;

      // Group by field
      if (!fieldRevenue[booking.fieldId]) {
        fieldRevenue[booking.fieldId] = 0;
      }
      fieldRevenue[booking.fieldId] += slotRevenue;
    });

    return {
      totalRevenue,
      confirmedRevenue,
      pendingRevenue,
      dailyRevenue,
      fieldRevenue,
    };
  }, [filteredBookings, bookingSlots, slots, payments]);

  // Calculate booking statistics
  const bookingStats = useMemo(() => {
    const statusCount = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };

    const fieldBookingCount = {};

    filteredBookings.forEach(booking => {
      // Count by status
      switch (booking.status) {
        case 0:
        case 2:
          statusCount.pending++;
          break;
        case 1:
          statusCount.confirmed++;
          break;
        case 4:
          statusCount.completed++;
          break;
        case 3:
          statusCount.cancelled++;
          break;
        default:
          statusCount.pending++;
      }

      // Count by field
      fieldBookingCount[booking.fieldId] = (fieldBookingCount[booking.fieldId] || 0) + 1;
    });

    return {
      total: filteredBookings.length,
      statusCount,
      fieldBookingCount,
    };
  }, [filteredBookings]);

  // Top performing fields
  const topFields = useMemo(() => {
    return fields
      .map(field => {
        const venue = venues.find(v => v.id === field.venueId);
        const revenue = revenueData.fieldRevenue[field.id] || 0;
        const bookingCount = bookingStats.fieldBookingCount[field.id] || 0;

        return {
          id: field.id,
          name: field.name,
          venueName: venue?.name || 'Unknown',
          revenue,
          bookings: bookingCount,
        };
      })
      .filter(f => f.bookings > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [fields, venues, revenueData, bookingStats]);

  // Prepare chart data for revenue trend
  const revenueChartData = useMemo(() => {
    const sortedDates = Object.keys(revenueData.dailyRevenue).sort();
    const last7Days = sortedDates.slice(-7);
    
    return last7Days.map(date => ({
      date,
      revenue: revenueData.dailyRevenue[date],
      label: new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    }));
  }, [revenueData]);

  const maxRevenue = Math.max(...revenueChartData.map(d => d.revenue), 1);

  const exportReport = (format) => {
    console.log(`Exporting ${selectedReport} report as ${format}`);
    // TODO: Implement actual export functionality
  };

  const reportTypes = [
    { id: 'revenue', name: 'Revenue Report', icon: DollarSign, color: 'revenue' },
    { id: 'bookings', name: 'Booking Report', icon: Calendar, color: 'bookings' },
  ];

  if (loading) {
    return (
      <div className="reports">
        <div className="reports-loading">Đang tải dữ liệu báo cáo...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports">
        <div className="reports-error">Lỗi tải dữ liệu: {error}</div>
      </div>
    );
  }

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
        {selectedReport === 'revenue' && (
          <>
            <div className="revenue-chart">
              <div className="chart-header">
                <h3 className="chart-title">Xu hướng doanh thu (7 ngày gần nhất)</h3>
                <BarChart className="chart-icon" />
              </div>
              <div className="chart-body">
                {revenueChartData.length > 0 ? (
                  revenueChartData.map((item, index) => (
                    <div key={index} className="bar-container">
                      <div
                        className="bar"
                        style={{ height: `${(item.revenue / maxRevenue) * 200}px` }}
                        title={`${item.revenue.toLocaleString('vi-VN')}đ vào ${item.label}`}
                      >
                        <span className="bar-tooltip">{(item.revenue / 1000).toFixed(0)}k</span>
                      </div>
                      <span className="bar-label">{item.label}</span>
                    </div>
                  ))
                ) : (
                  <div className="no-data">Không có dữ liệu doanh thu</div>
                )}
              </div>
            </div>

            <div className="top-fields-section">
              <div className="section-header">
                <h3 className="section-title">Sân hoạt động tốt nhất</h3>
                <TrendingUp className="section-icon" />
              </div>
              <div className="top-fields-list">
                {topFields.length > 0 ? (
                  topFields.map((field, index) => (
                    <div key={field.id} className="top-field-item">
                      <div className="field-rank">#{index + 1}</div>
                      <div className="field-info">
                        <div className="field-name">{field.name}</div>
                        <div className="field-venue">{field.venueName}</div>
                      </div>
                      <div className="field-stats">
                        <div className="field-bookings">{field.bookings} bookings</div>
                        <div className="field-revenue">{field.revenue.toLocaleString('vi-VN')}đ</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-data">Chưa có dữ liệu</div>
                )}
              </div>
            </div>
          </>
        )}

        {selectedReport === 'bookings' && (
          <>
            <div className="booking-status-chart">
              <div className="chart-header">
                <h3 className="chart-title">Phân bố trạng thái booking</h3>
                <Calendar className="chart-icon" />
              </div>
              <div className="status-grid">
                <div className="status-card status-pending">
                  <div className="status-icon">
                    <Clock size={24} />
                  </div>
                  <div className="status-info">
                    <div className="status-label">Chờ xác nhận</div>
                    <div className="status-count">{bookingStats.statusCount.pending}</div>
                  </div>
                </div>
                <div className="status-card status-confirmed">
                  <div className="status-icon">
                    <CheckCircle size={24} />
                  </div>
                  <div className="status-info">
                    <div className="status-label">Đã xác nhận</div>
                    <div className="status-count">{bookingStats.statusCount.confirmed}</div>
                  </div>
                </div>
                <div className="status-card status-completed">
                  <div className="status-icon">
                    <CheckCircle size={24} />
                  </div>
                  <div className="status-info">
                    <div className="status-label">Hoàn thành</div>
                    <div className="status-count">{bookingStats.statusCount.completed}</div>
                  </div>
                </div>
                <div className="status-card status-cancelled">
                  <div className="status-icon">
                    <XCircle size={24} />
                  </div>
                  <div className="status-info">
                    <div className="status-label">Đã hủy</div>
                    <div className="status-count">{bookingStats.statusCount.cancelled}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="recent-bookings-section">
              <div className="section-header">
                <h3 className="section-title">Booking gần đây</h3>
                <Calendar className="section-icon" />
              </div>
              <div className="bookings-table">
                <table>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Sân</th>
                      <th>Ngày</th>
                      <th>Số slot</th>
                      <th>Trạng thái</th>
                      <th>Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.slice(0, 10).map(booking => {
                      const field = fields.find(f => f.id === booking.fieldId);
                      const bookingSlotsList = bookingSlots.filter(bs => bs.bookingId === booking.id);
                      const slotMap = new Map(slots.map(s => [s.id, s]));
                      const revenue = bookingSlotsList.reduce((sum, bs) => {
                        const slot = slotMap.get(bs.slotId);
                        return sum + (slot?.price || 0);
                      }, 0);

                      const getStatusLabel = (status) => {
                        switch (status) {
                          case 0:
                          case 2:
                            return 'Chờ xác nhận';
                          case 1:
                            return 'Đã xác nhận';
                          case 4:
                            return 'Hoàn thành';
                          case 3:
                            return 'Đã hủy';
                          default:
                            return 'Không xác định';
                        }
                      };

                      const getStatusClass = (status) => {
                        switch (status) {
                          case 0:
                          case 2:
                            return 'status-badge-pending';
                          case 1:
                            return 'status-badge-confirmed';
                          case 4:
                            return 'status-badge-completed';
                          case 3:
                            return 'status-badge-cancelled';
                          default:
                            return 'status-badge-unknown';
                        }
                      };

                      return (
                        <tr key={booking.id}>
                          <td>#{booking.id}</td>
                          <td>{field?.name || 'N/A'}</td>
                          <td>{new Date(booking.date || booking.currentDate).toLocaleDateString('vi-VN')}</td>
                          <td>{bookingSlotsList.length} slots</td>
                          <td>
                            <span className={`status-badge ${getStatusClass(booking.status)}`}>
                              {getStatusLabel(booking.status)}
                            </span>
                          </td>
                          <td>{revenue.toLocaleString('vi-VN')}đ</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredBookings.length === 0 && (
                  <div className="no-data">Không có booking nào trong khoảng thời gian này</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="summary-stats">
        <div className="stat-card revenue-stat">
          <div className="stat-content">
            <div>
              <p className="stat-label">Tổng doanh thu</p>
              <p className="stat-value">{revenueData.totalRevenue.toLocaleString('vi-VN')}đ</p>
            </div>
            <DollarSign className="stat-icon" />
          </div>
        </div>

        <div className="stat-card bookings-stat">
          <div className="stat-content">
            <div>
              <p className="stat-label">Tổng Bookings</p>
              <p className="stat-value">{bookingStats.total}</p>
            </div>
            <Calendar className="stat-icon" />
          </div>
        </div>

        <div className="stat-card confirmed-stat">
          <div className="stat-content">
            <div>
              <p className="stat-label">Doanh thu đã xác nhận</p>
              <p className="stat-value">{revenueData.confirmedRevenue.toLocaleString('vi-VN')}đ</p>
            </div>
            <CheckCircle className="stat-icon" />
          </div>
        </div>

        <div className="stat-card fields-stat">
          <div className="stat-content">
            <div>
              <p className="stat-label">Số sân hoạt động</p>
              <p className="stat-value">{fields.length}</p>
            </div>
            <AlertCircle className="stat-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;