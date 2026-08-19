import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, children, hoverEffect = true, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-xl bg-surface border border-border p-6 text-text-primary',
        hoverEffect && 'transition-all duration-200 hover:border-border-strong hover:bg-surface-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
