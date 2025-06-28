import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  glow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
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
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';
  
  const variants = {
    primary: `bg-[#A8FF00] text-black hover:bg-[#96E600] focus:ring-[#A8FF00] ${glow ? 'shadow-lg shadow-[#A8FF00]/30 hover:shadow-xl hover:shadow-[#A8FF00]/40' : ''}`,
    secondary: 'bg-[#A259FF] text-white hover:bg-[#9147E6] focus:ring-[#A259FF]',
    outline: 'border-2 border-[#A8FF00] text-[#A8FF00] hover:bg-[#A8FF00] hover:text-black focus:ring-[#A8FF00]',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      )}
      {Icon && iconPosition === 'left' && !loading && <Icon size={20} />}
      {children}
      {Icon && iconPosition === 'right' && !loading && <Icon size={20} />}
    </button>
  );
};