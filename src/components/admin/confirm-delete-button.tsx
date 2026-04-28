'use client';

import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

type Props = {
  message: string;
  children?: ReactNode;
  className?: string;
  variant?: 'destructive' | 'ghost' | 'link' | 'outline' | 'default';
  size?: 'sm' | 'default' | 'lg';
};

export function ConfirmDeleteButton({
  message,
  children = 'Supprimer',
  className,
  variant = 'destructive',
  size = 'sm',
}: Props) {
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </Button>
  );
}

export function ConfirmActionButton({
  message,
  children,
  className,
  variant = 'default',
  size = 'default',
}: Props & { children: ReactNode }) {
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </Button>
  );
}
