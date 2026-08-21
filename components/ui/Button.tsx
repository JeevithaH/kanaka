import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glow';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-[#80664f] text-white hover:bg-[#5f4938]',
      secondary: 'bg-[#e0e0e0] text-[#161616] hover:bg-[#c6c6c6]',
      ghost: 'bg-transparent text-[#80664f] hover:bg-[#e8e8e8]',
      danger: 'bg-[#da1e28] text-white hover:bg-[#b81922]',
      glow: 'bg-[#80664f] text-white hover:bg-[#5f4938] shadow-[0_0_15px_rgba(128,102,79,0.3)]',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5',
      md: 'text-sm px-4 py-2.5',
      lg: 'text-sm px-6 py-3.5',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80664f] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
