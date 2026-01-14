'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Input, Textarea } from '@/components/ui';
import { Check, AlertCircle, Send } from '@/components/icons';
import { sendContactEmail } from '@/app/actions/send-email';
import type { FormType } from '@/lib/email';
import styles from './ContactForm.module.css';

interface ContactFormProps {
  formType: FormType;
  locale: string;
}

interface FormState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export function ContactForm({ formType, locale }: ContactFormProps) {
  const t = useTranslations('contribute.form');
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState<FormState>({ status: 'idle' });
  
  const handleSubmit = async () => {
    if (!formRef.current || isLoading) return;
    
    // Validate form
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }
    
    const formData = new FormData(formRef.current);
    const fields: Record<string, string> = {};
    
    formData.forEach((value, key) => {
      if (key !== 'email' && typeof value === 'string') {
        fields[key] = value;
      }
    });
    
    const userEmail = formData.get('email') as string | null;
    
    setIsLoading(true);
    setFormState({ status: 'loading' });
    
    try {
      const result = await sendContactEmail({
        formType,
        locale,
        fields,
        userEmail: userEmail || undefined,
      });
      
      if (result.success) {
        setFormState({ status: 'success' });
        formRef.current.reset();
      } else {
        setFormState({ 
          status: 'error', 
          message: result.error 
        });
      }
    } catch {
      setFormState({ 
        status: 'error', 
        message: locale === 'de' 
          ? 'Ein unerwarteter Fehler ist aufgetreten.' 
          : 'An unexpected error occurred.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (formState.status === 'success') {
    return (
      <div className={styles.successMessage}>
        <div className={styles.successIcon}>
          <Check size={24} />
        </div>
        <h3>{t('successTitle')}</h3>
        <p>{t('successMessage')}</p>
        <Button 
          variant="outline" 
          onClick={() => setFormState({ status: 'idle' })}
        >
          {t('sendAnother')}
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} className={styles.form} onSubmit={(e) => e.preventDefault()}>
      {formState.status === 'error' && formState.message && (
        <div className={styles.errorMessage}>
          <AlertCircle size={18} />
          <span>{formState.message}</span>
        </div>
      )}
      
      {formType === 'article-suggestion' && (
        <>
          <Input
            name="topic"
            label={t('topicLabel')}
            placeholder={t('topicPlaceholder')}
            required
            fullWidth
          />
          <Textarea
            name="details"
            label={t('detailsLabel')}
            placeholder={t('detailsPlaceholder')}
            hint={t('optionalHint')}
            fullWidth
          />
        </>
      )}
      
      {formType === 'bug-report' && (
        <>
          <Input
            name="problem"
            label={t('problemLabel')}
            placeholder={t('problemPlaceholder')}
            required
            fullWidth
          />
          <Input
            name="url"
            label={t('urlLabel')}
            placeholder={t('urlPlaceholder')}
            type="url"
            hint={t('optionalHint')}
            fullWidth
          />
          <Textarea
            name="details"
            label={t('additionalDetailsLabel')}
            placeholder={t('additionalDetailsPlaceholder')}
            hint={t('optionalHint')}
            fullWidth
          />
        </>
      )}
      
      {formType === 'improvement' && (
        <>
          <Input
            name="article"
            label={t('articleLabel')}
            placeholder={t('articlePlaceholder')}
            required
            fullWidth
          />
          <Textarea
            name="suggestion"
            label={t('suggestionLabel')}
            placeholder={t('suggestionPlaceholder')}
            required
            fullWidth
          />
        </>
      )}
      
      <div className={styles.emailField}>
        <Input
          name="email"
          type="email"
          label={t('emailLabel')}
          placeholder={t('emailPlaceholder')}
          hint={t('emailOptionalHint')}
          fullWidth
        />
      </div>
      
      <div className={styles.submitWrapper}>
        <Button 
          type="button"
          onClick={handleSubmit}
          variant="primary"
          isLoading={isLoading}
          rightIcon={<Send size={16} />}
          fullWidth
        >
          {t('submitButton')}
        </Button>
      </div>
    </form>
  );
}
