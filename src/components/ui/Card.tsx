import React, { forwardRef } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  className = '',
  hover = false,
  glow = false,
  style,
  onClick
}, ref) => {
  return (
    <div 
      ref={ref}
      style={style}
      onClick={onClick}
      className={`
        bg-light-card dark:bg-card-bg rounded-2xl shadow-lg 
        ${hover ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : ''} 
        ${glow ? 'hover:shadow-2xl hover:shadow-[#A8FF00]/20' : ''}
        transition-all duration-300 
        ${className}
      `}
    >
      {children}
    </div>
  );
});