import React from 'react';
import clsx from 'clsx';
import './Button.css';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  onClick,
  disabled = false,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'ad-button',
        `ad-button--${variant}`,
        `ad-button--${size}`,
        disabled && 'ad-button--disabled',
        className
      )}
    >
      {Icon && <Icon className="ad-button__icon" />}
      <span className="ad-button__text">{children}</span>
    </button>
  );
};
