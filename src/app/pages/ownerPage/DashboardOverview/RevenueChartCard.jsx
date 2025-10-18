import React from 'react';
import { BarChart3, ChevronRight } from 'lucide-react';
import './DashboardOverview.css';

const RevenueChartCard = ({ monthlyRevenue }) => {
  if (!Array.isArray(monthlyRevenue) || monthlyRevenue.length === 0) {
    return (
      <div className="chart-card revenue-chart">
        <div className="chart-header">
          <div className="chart-title-section">
            <h3 className="chart-title">Doanh Thu Hàng Tháng</h3>
            <p className="chart-subtitle">Không có dữ liệu doanh thu</p>
          </div>
        </div>
      </div>
    );
  }
  const maxRevenue = Math.max(...monthlyRevenue);
  return (
    <div className="chart-card revenue-chart">
      <div className="chart-header">
        <div className="chart-title-section">
          <h3 className="chart-title">Doanh Thu Hàng Tháng</h3>
          <p className="chart-subtitle">Xu hướng doanh thu trong 6 tháng qua</p>
        </div>
        <div className="chart-actions">
          <BarChart3 className="chart-icon" />
          <button className="chart-menu-button">
            <ChevronRight className="menu-icon" />
          </button>
        </div>
      </div>
      <div className="chart-container">
        {monthlyRevenue.map((revenue, index) => (
          <div key={index} className="bar-container">
            <div className="bar-wrapper">
              <div 
                className="revenue-bar"
                style={{
                  height: `${(revenue / maxRevenue) * 100}%`,
                  animationDelay: `${index * 0.1}s`
                }}
              ></div>
            </div>
            <span className="bar-label">
              ${(revenue / 1000).toFixed(0)}k
            </span>
            <span className="bar-month">
              {['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6'][index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueChartCard; 