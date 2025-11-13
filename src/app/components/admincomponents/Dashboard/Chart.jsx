import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import './Chart.css';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const Chart = ({
  data,
  type,
  xDataKey = 'date',
  yDataKey = 'amount',
  title,
  color = '#3B82F6',
  showFilter = false,
  fullData = [] // Dữ liệu đầy đủ để filter
}) => {
  const [timeFilter, setTimeFilter] = useState('day'); // 'day', 'month', 'year'

  // Xử lý dữ liệu theo filter
  const filteredData = useMemo(() => {
    if (!showFilter || !fullData || fullData.length === 0) {
      return data;
    }

    const now = new Date();
    let result = [];

    switch (timeFilter) {
      case 'day':
        // Lấy 7 ngày gần nhất
        result = fullData.slice(-7).map(item => ({
          ...item,
          [xDataKey]: new Date(item.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
        }));
        break;

      case 'month':
        // Lấy 7 tháng gần nhất, group theo tháng
        const monthlyData = {};
        fullData.forEach(item => {
          const date = new Date(item.date);
          const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { ...item, count: 1 };
          } else {
            monthlyData[monthKey][yDataKey] += item[yDataKey];
            if (item.bookings) monthlyData[monthKey].bookings = (monthlyData[monthKey].bookings || 0) + item.bookings;
            monthlyData[monthKey].count++;
          }
        });
        result = Object.entries(monthlyData)
          .slice(-7)
          .map(([key, value]) => ({
            ...value,
            [xDataKey]: key
          }));
        break;

      case 'year':
        // Lấy 7 năm gần nhất, group theo năm
        const yearlyData = {};
        fullData.forEach(item => {
          const year = new Date(item.date).getFullYear().toString();
          if (!yearlyData[year]) {
            yearlyData[year] = { ...item, count: 1 };
          } else {
            yearlyData[year][yDataKey] += item[yDataKey];
            if (item.bookings) yearlyData[year].bookings = (yearlyData[year].bookings || 0) + item.bookings;
            yearlyData[year].count++;
          }
        });
        result = Object.entries(yearlyData)
          .slice(-7)
          .map(([key, value]) => ({
            ...value,
            [xDataKey]: key
          }));
        break;

      default:
        result = data;
    }

    return result;
  }, [timeFilter, data, fullData, showFilter, xDataKey, yDataKey]);
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="ad-chart__tooltip">
          <p className="ad-chart__tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p 
              key={index} 
              className="ad-chart__tooltip-value"
              style={{ color: entry.color }}
            >
              {entry.name}: {typeof entry.value === 'number' && entry.name.includes('amount') 
                ? formatCurrency(entry.value) 
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey={xDataKey} 
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickFormatter={yDataKey.includes('amount') ? formatCurrency : undefined}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey={yDataKey} 
              stroke={color} 
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            />
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey={xDataKey} 
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickFormatter={yDataKey.includes('amount') ? formatCurrency : undefined}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={yDataKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => {
                const pct = typeof percent === 'number' ? `${(percent * 100).toFixed(0)}%` : '';
                return `${name} ${pct}`;
              }}
              outerRadius={80}
              fill="#8884d8"
              dataKey={yDataKey}
            >
              {filteredData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        );
      
      default:
        return <></>;
    }
  };

  return (
    <div className="ad-chart">
      <div className="ad-chart__header">
        <h3 className="ad-chart__title">
          {title}
        </h3>
        {showFilter && (
          <div className="ad-chart__filter">
            <button
              className={`ad-chart__filter-btn ${timeFilter === 'day' ? 'ad-chart__filter-btn--active' : ''}`}
              onClick={() => setTimeFilter('day')}
            >
              Ngày
            </button>
            <button
              className={`ad-chart__filter-btn ${timeFilter === 'month' ? 'ad-chart__filter-btn--active' : ''}`}
              onClick={() => setTimeFilter('month')}
            >
              Tháng
            </button>
            <button
              className={`ad-chart__filter-btn ${timeFilter === 'year' ? 'ad-chart__filter-btn--active' : ''}`}
              onClick={() => setTimeFilter('year')}
            >
              Năm
            </button>
          </div>
        )}
      </div>
      <div className="ad-chart__container">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
