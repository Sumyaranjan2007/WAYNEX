import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightElement,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-navy-200"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-navy-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full bg-navy-900/80 border border-navy-700/80 text-white placeholder-navy-400 text-sm rounded-lg py-2.5 px-3.5 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500',
              'disabled:bg-navy-950 disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon ? 'pl-10' : '',
              rightElement ? 'pr-11' : '',
              error ? 'border-sos-600 focus:ring-sos-500/50 focus:border-sos-600' : '',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center text-navy-400">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-400 mt-1 font-medium">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-xs text-navy-400 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
