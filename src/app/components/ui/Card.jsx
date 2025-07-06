import React, { forwardRef } from 'react';
import './Card.css';

export const Card = forwardRef(({
  children,
  className = '',
  hover = false,
  glow = false,
  style,
  onClick
}, ref) => {
  
  const getCardClasses = () => {
    const classes = ['card'];
    
    // Add hover effect if enabled
    if (hover) {
      classes.push('card--hover');
    }
    
    // Add glow effect if enabled
    if (glow) {
      classes.push('card--glow');
    }
    
    // Add custom className
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  };

  return (
    <div 
      ref={ref}
      style={style}
      onClick={onClick}
      className={getCardClasses()}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';