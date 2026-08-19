import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'foundational' | 'intermediate' | 'advanced' | 'primary' | 'success';
}

function Badge({ className, variant = 'primary', ...props }: BadgeProps) {
  const variants = {
    foundational: 'bg-[#defbe6] text-[#198038]',
    intermediate: 'bg-[#d0e2ff] text-[#0043ce]',
    advanced: 'bg-[#e8daff] text-[#6929c4]',
    primary: 'bg-[#d0e2ff] text-[#0043ce]',
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
