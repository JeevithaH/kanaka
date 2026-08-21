import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'foundational' | 'intermediate' | 'advanced' | 'primary' | 'success';
}

function Badge({ className, variant = 'primary', ...props }: BadgeProps) {
  const variants = {
    foundational: 'bg-[#defbe6] text-[#198038]',
    intermediate: 'bg-[#e2ddd7] text-[#5f4938]',
    advanced: 'bg-[#e8daff] text-[#6929c4]',
    primary: 'bg-[#e2ddd7] text-[#5f4938]',
    success: 'bg-[#defbe6] text-[#198038]',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-none px-2 py-0.5 text-xs font-normal border border-transparent',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
