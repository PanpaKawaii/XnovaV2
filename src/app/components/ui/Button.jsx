import React from 'react';
import './Button.css';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  glow = false,
  className = '',
  ...props
}) => {
  const getButtonClasses = () => {
    const classes = ['button'];
    
    // Add variant class
    classes.push(`button--${variant}`);
    
    // Add size class
    classes.push(`button--${size}`);
    
    // Add glow class if needed
    if (glow && variant === 'primary') {
      classes.push('button--glow');
    }
    
    // Add custom className
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  };

  return (
    <button
      className={getButtonClasses()}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <div className="button__spinner" />
      )}
      {Icon && iconPosition === 'left' && !loading && (
        <Icon size={20} className="button__icon" />
      )}
      {children}
      {Icon && iconPosition === 'right' && !loading && (
        <Icon size={20} className="button__icon" />
      )}
    </button>
  );
};