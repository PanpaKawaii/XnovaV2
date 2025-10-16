import React from 'react';
import './StatsCard.css';

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'neutral',
  color = 'blue'
}) => {
  const isDark = document.documentElement.classList.contains('dark');
  
  return (
    <div className={`stats-card ${isDark ? 'dark' : ''}`}>
      <div className="stats-card-content">
        <div className="stats-card-info">
          <p className="stats-card-title">{title}</p>
          <p className="stats-card-value">{value}</p>
          {change && (
            <p className={`stats-card-change ${changeType}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`stats-card-icon ${color}`}>
          <Icon />
        </div>
      </div>
    </div>
  );
};
