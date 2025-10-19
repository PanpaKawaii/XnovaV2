// Voucher.jsx
import { Calendar, Gift } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchData } from '../../../../mocks/CallingAPI';
import { useAuth } from '../../../hooks/AuthContext/AuthContext.jsx';
import { useTheme } from '../../../hooks/ThemeContext';
import './Voucher.css';

const Voucher = () => {
  const { user } = useAuth();

  const { isDarkMode } = useTheme();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const [userVouchers, setUserVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserVoucherData = async () => {
      const token = user?.token || null;
      try {
        const vouchersResponse = await fetchData('Voucher', token);
        const userVouchersResponse = await fetchData('UserVoucher', token);

        const voucherMap = Object.fromEntries(vouchersResponse.map(v => [v.id, v]));
        const newUserVoucher = userVouchersResponse
          .filter(uv => uv.userId === user?.id)
          .map(uv => ({
            ...uv,
            voucher: voucherMap[uv.voucherId],
          }));


        setUserVouchers(newUserVoucher);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching user voucher data:', JSON.stringify(err));
      } finally {
        setLoading(false);
      }
    };

    fetchUserVoucherData();
  }, [user?.token]);

  const filteredVouchers = userVouchers.filter(v => {
    if (filter === 'all') return true;
    return v.voucher.type === filter;
  });

  const sortedVouchers = [...filteredVouchers].sort((a, b) => {
    if (sortBy === 'receive') {
      return new Date(b.receive) - new Date(a.receive);
    } else if (sortBy === 'name') {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    }
    return 0;
  });

  if (loading) {
    return <div className={`voucher${isDarkMode ? ' dark' : ''} loading`}>Loading vouchers...</div>;
  }

  return (
    <div className={`voucher${isDarkMode ? ' dark' : ''}`}>
      <div className="header">
        <Gift className="header-icon" />
        <h3 className="title">My Vouchers</h3>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label className="label">Filter by Status</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select"
          >
            <option value="all">All Vouchers</option>
            <option value="Percent">Percent</option>
            <option value="Value">Value</option>
          </select>
        </div>
        <div className="filter-group">
          <label className="label">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select"
          >
            <option value="name">Name</option>
            <option value="receive">Receive</option>
          </select>
        </div>
      </div>

      <div className="voucher-list-container">
        <div className="voucher-list">
          {sortedVouchers.map((v) => (
            <div key={v.id} className="voucher-card">
              <div className="card-content">
                <div className="voucher-info">
                  <div className="voucher-name">
                    <Gift className="gift-icon" />
                    <h4 className="voucher-title">{v.voucher.name}</h4>
                  </div>
                  <div className="details">
                    <div className="receive">
                      <Calendar className="calendar-icon" />
                      <span>Receive: {new Date(v.receiveDate).toLocaleDateString()}</span>
                    </div>
                    <div className="discount">
                      <span>Đơn tối thiểu {v.voucher.minEffect.toLocaleString('vi-VN')} đồng</span>
                    </div>
                    <div className="discount">
                      <span>Giảm tối đa {v.voucher.maxEffect.toLocaleString('vi-VN')} đồng</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {sortedVouchers.length === 0 && (
        <div className="no-vouchers">
          <Gift className="no-vouchers-icon" />
          <p>No vouchers found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default Voucher;