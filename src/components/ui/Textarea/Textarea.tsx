'use client';

import { forwardRef, TextareaHTMLAttributes, useId } from 'react';
import styles from './Textarea.module.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  hint?: string;
  label?: string;
  fullWidth?: boolean;
  'data-testid'?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      error,
      hint,
      label,
      fullWidth = false,
      className = '',
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || `textarea-${generatedId}`;
    
    const wrapperClasses = [
      styles.wrapper,
      fullWidth && styles.fullWidth,
      error && styles.hasError,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses} data-testid={props['data-testid'] ? `${props['data-testid']}-wrapper` : 'textarea-wrapper'}>
        {label && (
          <label htmlFor={textareaId} className={styles.label} data-testid={props['data-testid'] ? `${props['data-testid']}-label` : 'textarea-label'}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={styles.textarea}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          data-testid={props['data-testid'] || 'textarea'}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className={styles.error} role="alert" data-testid={props['data-testid'] ? `${props['data-testid']}-error` : 'textarea-error'}>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${textareaId}-hint`} className={styles.hint} data-testid={props['data-testid'] ? `${props['data-testid']}-hint` : 'textarea-hint'}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
