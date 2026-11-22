import { type ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}

export function Container({ children, className = '', narrow = false }: ContainerProps) {
  const widthClass = narrow ? 'max-w-[960px]' : 'max-w-[1160px]';
  return (
    <div className={`${widthClass} mx-auto px-[18px] sm:px-6 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}
