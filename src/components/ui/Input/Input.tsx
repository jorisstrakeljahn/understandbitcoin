'use client';

import { forwardRef, InputHTMLAttributes, ReactNode, useId } from 'react';
import styles from './Input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
  hint?: string;
  label?: string;
  fullWidth?: boolean;
  'data-testid'?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      leftIcon,
      rightIcon,
      error,
      hint,
      label,
      fullWidth = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || `input-${generatedId}`;
    
    const wrapperClasses = [
      styles.wrapper,
      fullWidth && styles.fullWidth,
      error && styles.hasError,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses} data-testid={props['data-testid'] ? `${props['data-testid']}-wrapper` : 'input-wrapper'}>
        {label && (
          <label htmlFor={inputId} className={styles.label} data-testid={props['data-testid'] ? `${props['data-testid']}-label` : 'input-label'}>
            {label}
          </label>
        )}
        <div className={styles.inputWrapper}>
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={styles.input}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            data-testid={props['data-testid'] || 'input'}
            {...props}
          />
          {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
        </div>
        {error && (
          <p id={`${inputId}-error`} className={styles.error} role="alert" data-testid={props['data-testid'] ? `${props['data-testid']}-error` : 'input-error'}>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className={styles.hint} data-testid={props['data-testid'] ? `${props['data-testid']}-hint` : 'input-hint'}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
