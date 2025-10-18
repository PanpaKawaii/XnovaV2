import React from 'react';
import clsx from 'clsx';
import './StatsCard.css';

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'neutral',
  color = 'blue'
}) => {
  return (
    <div className="ad-stats-card">
      <div className="ad-stats-card__content">
        <div className="ad-stats-card__info">
          <p className="ad-stats-card__title">{title}</p>
          <p className="ad-stats-card__value">{value}</p>
          {change && (
            <p className={clsx(
              'ad-stats-card__change',
              `ad-stats-card__change--${changeType}`
            )}>
              {change}
            </p>
          )}
        </div>
        <div className={clsx(
          'ad-stats-card__icon-wrapper',
          `ad-stats-card__icon-wrapper--${color}`
        )}>
          <Icon className="ad-stats-card__icon" />
        </div>
      </div>
    </div>
  );
};
