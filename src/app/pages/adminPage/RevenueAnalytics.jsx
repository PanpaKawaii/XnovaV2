import React, { useEffect, useState } from 'react';
import { Download, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { Chart } from '../../components/admincomponents/Dashboard/Chart';
import { Button } from '../../components/admincomponents/UI/Button';
import { FilterSelect } from '../../components/admincomponents/UI/FilterSelect';
import { fetchData } from '../../../mocks/CallingAPI.js';
import { useAuth } from '../../hooks/AuthContext/AuthContext.jsx';
import { generatePagination } from '../../utils/pagination.js';
import './RevenueAnalytics.css';

// Dữ liệu sẽ lấy từ API Payment

export const RevenueAnalytics = () => {
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [revenueFullData, setRevenueFullData] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [weekRevenue, setWeekRevenue] = useState(0);
  const [monthRevenue, setMonthRevenue] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [transactionFilter, setTransactionFilter] = useState('day');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = user?.token;
        if (!token) {
          setRevenueChartData([]);
          setTodayRevenue(0);
          setWeekRevenue(0);
          setMonthRevenue(0);
          setLoading(false);
          return;
        }

        // Lấy tất cả booking để gom doanh thu từ payments trong từng booking (tránh miss data)
        const bookings = await fetchData('booking', token);
        // Đồng thời cố gắng lấy Users và Payments để build bảng giao dịch gần đây
        let users = [];
        let payments = [];
        try {
          const [usersResp, paymentsResp] = await Promise.all([
            fetchData('User', token),
            fetchData('Payment', token)
          ]);
          users = Array.isArray(usersResp) ? usersResp : [];
          payments = Array.isArray(paymentsResp) ? paymentsResp : [];
        } catch (_) {
          // Nếu không có endpoint Payment/User hoặc lỗi, tiếp tục với dữ liệu từ bookings
          users = [];
          payments = [];
        }
        const now = new Date();
        const todayStr = now.toISOString().slice(0, 10);

        // Gom doanh thu theo ngày (yyyy-mm-dd)
        const amountsByDay = new Map();
        let todaySum = 0;
        let weekSum = 0;
        let monthSum = 0;

        // Xác định đầu tuần (Thứ 2)
        const startOfWeek = new Date(now);
        const day = startOfWeek.getDay(); // 0 CN, 1 T2, ... 6 T7
        const diffToMonday = (day + 6) % 7; // số ngày lùi về thứ 2
        startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        // Duyệt qua tất cả booking và payments trong từng booking
        bookings?.forEach(b => {
          if (Array.isArray(b.payments)) {
            b.payments.forEach(p => {
              if (!p?.date || typeof p.amount !== 'number') return;
              const dayKey = p.date.slice(0, 10);
              amountsByDay.set(dayKey, (amountsByDay.get(dayKey) || 0) + p.amount);

              // Today
              if (dayKey === todayStr) {
                todaySum += p.amount;
              }
              // Week (tuần này từ thứ 2 đến hôm nay)
              const d = new Date(p.date);
              if (d >= startOfWeek && d <= now) {
                weekSum += p.amount;
              }
              // Month (tháng hiện tại)
              if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
                monthSum += p.amount;
              }
            });
          }
        });

        

        // Tạo dữ liệu biểu đồ (7 ngày gần nhất có trong dữ liệu)
        const sortedDays = Array.from(amountsByDay.keys()).sort();
        const full = sortedDays.map(d => {
          // Không còn áp dụng baseline cho ngày hôm nay
          return { date: d, amount: amountsByDay.get(d) };
        });
        const last7 = full.slice(-7).map(item => ({
          date: new Date(item.date).toLocaleDateString('vi-VN'),
          amount: item.amount
        }));

        setRevenueFullData(full);
        setRevenueChartData(last7);
        setTodayRevenue(todaySum);
        setWeekRevenue(weekSum);
        setMonthRevenue(monthSum);

        // Build Recent Transactions từ Payments API (ưu tiên) hoặc fallback từ payments trong bookings
        const bookingsById = new Map((bookings || []).map(b => [b.id, b]));
        const usersById = new Map((users || []).map(u => [u.id, u]));

        // Helper: map status number to UI badge status
        const mapPaymentStatus = (s) => {
          // Giả định: 1=completed, 0=pending, 2=failed (có thể điều chỉnh theo backend)
          if (s === 1) return 'completed';
          if (s === 2) return 'failed';
          return 'completed';
        };

        let txns = [];
        if (payments.length > 0) {
          txns = payments
            .filter(p => typeof p.amount === 'number' && p.date)
            .map(p => {
              const bk = bookingsById.get(p.bookingId);
              const userName = usersById.get(bk?.userId)?.name || usersById.get(bk?.userId)?.fullName || 'Người dùng';
              return {
                id: p.id,
                amount: p.amount,
                date: p.date,
                status: mapPaymentStatus(p.status),
                user: userName
              };
            });
        } else {
          // Fallback: flatten payments từ bookings
          txns = (bookings || []).flatMap(b =>
            (Array.isArray(b.payments) ? b.payments : []).map(p => ({
              id: p.id,
              amount: p.amount,
              date: p.date,
              status: mapPaymentStatus(p.status),
              user: usersById.get(b.userId)?.name || usersById.get(b.userId)?.fullName || 'Người dùng'
            }))
          );
        }

        // Sắp xếp mới nhất trước
        txns.sort((a, b) => new Date(b.date) - new Date(a.date));
        setAllTransactions(txns);
        setRecentTransactions(txns); // Will be filtered by transactionFilter
      } catch (e) {
        setError('Lỗi khi tải dữ liệu doanh thu');
        setRevenueChartData([]);
        setTodayRevenue(0);
        setWeekRevenue(0);
        setMonthRevenue(0);
        setRecentTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [user]);

  // Filter transactions based on selected time period
  useEffect(() => {
    if (allTransactions.length === 0) {
      setRecentTransactions([]);
      return;
    }

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    let filtered = [];

    switch (transactionFilter) {
      case 'day':
        // Today's transactions
        filtered = allTransactions.filter(t => {
          const txDate = t.date.slice(0, 10);
          return txDate === todayStr;
        });
        break;

      case 'week':
        // This week's transactions (from Monday to today)
        const startOfWeek = new Date(now);
        const day = startOfWeek.getDay();
        const diffToMonday = (day + 6) % 7;
        startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        filtered = allTransactions.filter(t => {
          const txDate = new Date(t.date);
          return txDate >= startOfWeek && txDate <= now;
        });
        break;

      case 'month':
        // This month's transactions
        filtered = allTransactions.filter(t => {
          const txDate = new Date(t.date);
          return txDate.getMonth() === now.getMonth() && 
                 txDate.getFullYear() === now.getFullYear();
        });
        break;

      case 'all':
        // All transactions
        filtered = allTransactions;
        break;

      default:
        filtered = allTransactions;
    }

    setRecentTransactions(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [transactionFilter, allTransactions]);

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

  const transactionFilterOptions = [
    { value: 'day', label: 'Hôm nay' },
    { value: 'week', label: 'Tuần này' },
    { value: 'month', label: 'Tháng này' },
    { value: 'all', label: 'Tất cả' }
  ];

  // Pagination logic
  const totalPages = Math.ceil(recentTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = recentTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // recentTransactions được xây từ API ở trên

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
              {loading ? '...' : formatCurrency(todayRevenue)}
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
              {loading ? '...' : formatCurrency(weekRevenue)}
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
              {loading ? '...' : formatCurrency(monthRevenue)}
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
              {loading ? '...' : formatCurrency(0)}
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
          data={revenueChartData}
          type="line"
          xDataKey="date"
          yDataKey="amount"
          title="Xu hướng doanh thu theo ngày"
          color="#10B981"
          showFilter={true}
          fullData={revenueFullData}
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
          <FilterSelect
            options={transactionFilterOptions}
            value={transactionFilter}
            onChange={setTransactionFilter}
            placeholder="Lọc theo thời gian"
          />
        </div>
        <div className="ad-revenue-transactions__table-wrapper">
          <table className="ad-revenue-transactions__table">
            <thead className="ad-revenue-transactions__thead">
              <tr>
                <th className="ad-revenue-transactions__th">Người dùng</th>
                <th className="ad-revenue-transactions__th">Số tiền</th>
                <th className="ad-revenue-transactions__th">Ngày</th>
                <th className="ad-revenue-transactions__th">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="ad-revenue-transactions__tbody">
              {paginatedTransactions.length === 0 ? (
                <tr className="ad-revenue-transactions__row">
                  <td colSpan="4" className="ad-revenue-transactions__td" style={{ textAlign: 'center' }}>
                    Không có giao dịch trong thời gian này
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="ad-revenue-transactions__row">
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
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        {recentTransactions.length > itemsPerPage && (
          <div className="ad-revenue-pagination">
            <div className="ad-revenue-pagination__info">
              Hiển thị {startIndex + 1}-{Math.min(endIndex, recentTransactions.length)} trong tổng số {recentTransactions.length} giao dịch
            </div>
            <div className="ad-revenue-pagination__controls">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="ad-revenue-pagination__button"
              >
                Trước
              </button>
              <div className="ad-revenue-pagination__pages">
                {generatePagination(currentPage, totalPages).map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="ad-revenue-pagination__ellipsis">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`ad-revenue-pagination__page ${currentPage === page ? 'ad-revenue-pagination__page--active' : ''}`}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="ad-revenue-pagination__button"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
