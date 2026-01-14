'use client';

import { forwardRef, SelectHTMLAttributes, useId } from 'react';
import { ChevronDown } from '@/components/icons';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
  error?: string;
  hint?: string;
  label?: string;
  fullWidth?: boolean;
  placeholder?: string;
  'data-testid'?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      error,
      hint,
      label,
      fullWidth = false,
      placeholder,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || `select-${generatedId}`;
    
    const wrapperClasses = [
      styles.wrapper,
      fullWidth && styles.fullWidth,
      error && styles.hasError,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses} data-testid={props['data-testid'] ? `${props['data-testid']}-wrapper` : 'select-wrapper'}>
        {label && (
          <label htmlFor={selectId} className={styles.label} data-testid={props['data-testid'] ? `${props['data-testid']}-label` : 'select-label'}>
            {label}
          </label>
        )}
        <div className={styles.selectWrapper}>
          <select
            ref={ref}
            id={selectId}
            className={styles.select}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
            data-testid={props['data-testid'] || 'select'}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className={styles.chevron}>
            <ChevronDown size={18} />
          </span>
        </div>
        {error && (
          <p id={`${selectId}-error`} className={styles.error} role="alert" data-testid={props['data-testid'] ? `${props['data-testid']}-error` : 'select-error'}>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${selectId}-hint`} className={styles.hint} data-testid={props['data-testid'] ? `${props['data-testid']}-hint` : 'select-hint'}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
