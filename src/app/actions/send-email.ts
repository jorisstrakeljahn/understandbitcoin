'use server';

import { resend, emailConfig, generateSubject, generateTextBody, generateHtmlBody, type FormType } from '@/lib/email';

interface SendEmailInput {
  formType: FormType;
  locale: string;
  fields: Record<string, string>;
  userEmail?: string;
}

interface SendEmailResult {
  success: boolean;
  error?: string;
}

export async function sendContactEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const { formType, locale, fields } = input;
  
  // Normalize email: trim whitespace and convert empty strings to undefined
  const userEmail = input.userEmail?.trim() || undefined;

  // Basic validation
  if (!formType || !locale || !fields) {
    return {
      success: false,
      error: locale === 'de' ? 'Ungültige Formulardaten' : 'Invalid form data',
    };
  }

  // Validate required fields based on form type
  const requiredFields = getRequiredFields(formType);
  for (const field of requiredFields) {
    if (!fields[field] || fields[field].trim() === '') {
      return {
        success: false,
        error: locale === 'de' 
          ? 'Bitte fülle alle Pflichtfelder aus' 
          : 'Please fill in all required fields',
      };
    }
  }

  // Validate email format if provided
  if (userEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return {
        success: false,
        error: locale === 'de' 
          ? 'Bitte gib eine gültige E-Mail-Adresse an' 
          : 'Please provide a valid email address',
      };
    }
  }

  try {
    const data = { formType, locale, fields, userEmail };
    
    const { error } = await resend.emails.send({
      from: emailConfig.from,
      to: emailConfig.to,
      replyTo: userEmail || emailConfig.replyToDefault,
      subject: generateSubject(data),
      text: generateTextBody(data),
      html: generateHtmlBody(data),
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        success: false,
        error: locale === 'de' 
          ? 'E-Mail konnte nicht gesendet werden. Bitte versuche es später erneut.' 
          : 'Failed to send email. Please try again later.',
      };
    }

    return { success: true };
  } catch (err) {
    console.error('Email send error:', err);
    return {
      success: false,
      error: locale === 'de' 
        ? 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später erneut.' 
        : 'An unexpected error occurred. Please try again later.',
    };
  }
}

function getRequiredFields(formType: FormType): string[] {
  switch (formType) {
    case 'article-suggestion':
      return ['topic'];
    case 'bug-report':
      return ['problem'];
    case 'improvement':
      return ['article', 'suggestion'];
    default:
      return [];
  }
}
