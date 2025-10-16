// Voucher.jsx
import React, { useState, useEffect } from 'react';
import { Gift, Calendar } from 'lucide-react';
import { useTheme } from '../../../hooks/ThemeContext';
import './Voucher.css';

const currentDate = new Date('2025-07-19');

const sampleData = [
  {
    id: 1,
    receiveDate: "2025-08-31T00:00:00.000Z",
    userId: 1,
    voucherId: 1,
    user: "john_doe",
    voucher: {
      id: 1,
      name: "SUMMER25",
      type: "percentage",
      amount: 25,
      minEffect: 50,
      maxEffect: 100,
      status: 0,
      userVouchers: ["john_doe"]
    }
  },
  {
    id: 2,
    receiveDate: "2025-07-15T00:00:00.000Z",
    userId: 1,
    voucherId: 2,
    user: "john_doe",
    voucher: {
      id: 2,
      name: "WELCOME10",
      type: "fixed",
      amount: 10,
      minEffect: 20,
      maxEffect: 0,
      status: 0,
      userVouchers: ["john_doe"]
    }
  },
  {
    id: 2,
    receiveDate: "2025-07-15T00:00:00.000Z",
    userId: 1,
    voucherId: 2,
    user: "john_doe",
    voucher: {
      id: 2,
      name: "WELCOME10",
      type: "fixed",
      amount: 10,
      minEffect: 20,
      maxEffect: 0,
      status: 0,
      userVouchers: ["john_doe"]
    }
  },
  {
    id: 2,
    receiveDate: "2025-07-15T00:00:00.000Z",
    userId: 1,
    voucherId: 2,
    user: "john_doe",
    voucher: {
      id: 2,
      name: "WELCOME10",
      type: "fixed",
      amount: 10,
      minEffect: 20,
      maxEffect: 0,
      status: 0,
      userVouchers: ["john_doe"]
    }
  },
  {
    id: 3,
    receiveDate: "2025-09-15T00:00:00.000Z",
    userId: 1,
    voucherId: 3,
    user: "john_doe",
    voucher: {
      id: 3,
      name: "TEAM20",
      type: "percentage",
      amount: 20,
      minEffect: 100,
      maxEffect: 200,
      status: 0,
      userVouchers: ["john_doe"]
    }
  }
];

const Voucher = () => {
  const { isDarkMode } = useTheme();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('expiry');

  useEffect(() => {
    const data = sampleData;

    const processed = data.map(item => ({
      id: item.id,
      code: item.voucher.name,
      discount: item.voucher.type === 'percentage' 
        ? `${item.voucher.amount}% off` 
        : `$${item.voucher.amount} off`,
      expiry: item.receiveDate,
      status: item.voucher.status === 0 && new Date(item.receiveDate) >= currentDate ? 'active' : 'expired',
      minEffect: item.voucher.minEffect,
      maxEffect: item.voucher.maxEffect
    }));
    setVouchers(processed);
    setLoading(false);
  }, []);

  const filteredVouchers = vouchers.filter(voucher => {
    if (filter === 'all') return true;
    return voucher.status === filter;
  });

  const sortedVouchers = [...filteredVouchers].sort((a, b) => {
    if (sortBy === 'expiry') {
      return new Date(b.expiry) - new Date(a.expiry);
    } else if (sortBy === 'code') {
      return a.code.localeCompare(b.code);
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
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        <div className="filter-group">
          <label className="label">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select"
          >
            <option value="expiry">Expiry Date</option>
            <option value="code">Code</option>
          </select>
        </div>
      </div>

      <div className="voucher-list-container">
        <div className="voucher-list">
          {sortedVouchers.map((voucher) => (
            <div key={voucher.id} className="voucher-card">
              <div className="card-content">
                <div className="voucher-info">
                  <div className="voucher-name">
                    <Gift className="gift-icon" />
                    <h4 className="voucher-title">{voucher.code}</h4>
                  </div>
                  <div className="details">
                    <div className="discount">
                      <span>{voucher.discount}</span>
                    </div>
                    <div className="expiry">
                      <Calendar className="calendar-icon" />
                      <span>Expires: {new Date(voucher.expiry).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="status-section">
                  <span className={`status ${voucher.status}`}>
                    {voucher.status.charAt(0).toUpperCase() + voucher.status.slice(1)}
                  </span>
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