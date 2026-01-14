import { FormType, formTypeLabels } from './config';

interface EmailTemplateData {
  formType: FormType;
  locale: string;
  fields: Record<string, string>;
  userEmail?: string;
}

/**
 * Generate email subject based on form type and primary field
 */
export function generateSubject(data: EmailTemplateData): string {
  const label = formTypeLabels[data.formType][data.locale as 'de' | 'en'] || formTypeLabels[data.formType].en;
  
  // Get the primary field value for the subject
  let primaryValue = '';
  switch (data.formType) {
    case 'article-suggestion':
      primaryValue = data.fields.topic || '';
      break;
    case 'bug-report':
      primaryValue = data.fields.problem || '';
      break;
    case 'improvement':
      primaryValue = data.fields.article || '';
      break;
  }
  
  // Truncate if too long
  if (primaryValue.length > 50) {
    primaryValue = primaryValue.substring(0, 47) + '...';
  }
  
  return `[${label}] ${primaryValue}`;
}

/**
 * Generate plain text email body
 */
export function generateTextBody(data: EmailTemplateData): string {
  const label = formTypeLabels[data.formType][data.locale as 'de' | 'en'] || formTypeLabels[data.formType].en;
  const isGerman = data.locale === 'de';
  
  const separator = '─'.repeat(50);
  
  let body = `${separator}\n`;
  body += isGerman ? `NEUER BEITRAG - ${label}\n` : `NEW SUBMISSION - ${label}\n`;
  body += `${separator}\n\n`;
  
  // Add fields based on form type
  switch (data.formType) {
    case 'article-suggestion':
      body += isGerman ? 'Thema/Frage:\n' : 'Topic/Question:\n';
      body += `${data.fields.topic || '-'}\n\n`;
      if (data.fields.details) {
        body += isGerman ? 'Details:\n' : 'Details:\n';
        body += `${data.fields.details}\n\n`;
      }
      break;
      
    case 'bug-report':
      body += isGerman ? 'Problem:\n' : 'Problem:\n';
      body += `${data.fields.problem || '-'}\n\n`;
      if (data.fields.url) {
        body += isGerman ? 'Artikel-URL:\n' : 'Article URL:\n';
        body += `${data.fields.url}\n\n`;
      }
      if (data.fields.details) {
        body += isGerman ? 'Weitere Details:\n' : 'Additional Details:\n';
        body += `${data.fields.details}\n\n`;
      }
      break;
      
    case 'improvement':
      body += isGerman ? 'Artikel:\n' : 'Article:\n';
      body += `${data.fields.article || '-'}\n\n`;
      body += isGerman ? 'Verbesserungsvorschlag:\n' : 'Suggestion:\n';
      body += `${data.fields.suggestion || '-'}\n\n`;
      break;
  }
  
  // Add contact email
  body += separator + '\n';
  body += isGerman ? 'Kontakt-Email:\n' : 'Contact Email:\n';
  body += data.userEmail || (isGerman ? 'Nicht angegeben' : 'Not provided');
  body += '\n\n';
  
  body += separator + '\n';
  body += isGerman ? 'Gesendet über thereforbitcoin.com\n' : 'Sent via thereforbitcoin.com\n';
  body += `Sprache/Language: ${data.locale.toUpperCase()}\n`;
  
  return body;
}

/**
 * Generate HTML email body
 */
export function generateHtmlBody(data: EmailTemplateData): string {
  const label = formTypeLabels[data.formType][data.locale as 'de' | 'en'] || formTypeLabels[data.formType].en;
  const isGerman = data.locale === 'de';
  
  const fields: { label: string; value: string }[] = [];
  
  switch (data.formType) {
    case 'article-suggestion':
      fields.push({
        label: isGerman ? 'Thema/Frage' : 'Topic/Question',
        value: data.fields.topic || '-',
      });
      if (data.fields.details) {
        fields.push({
          label: isGerman ? 'Details' : 'Details',
          value: data.fields.details,
        });
      }
      break;
      
    case 'bug-report':
      fields.push({
        label: isGerman ? 'Problem' : 'Problem',
        value: data.fields.problem || '-',
      });
      if (data.fields.url) {
        fields.push({
          label: isGerman ? 'Artikel-URL' : 'Article URL',
          value: `<a href="${data.fields.url}">${data.fields.url}</a>`,
        });
      }
      if (data.fields.details) {
        fields.push({
          label: isGerman ? 'Weitere Details' : 'Additional Details',
          value: data.fields.details,
        });
      }
      break;
      
    case 'improvement':
      fields.push({
        label: isGerman ? 'Artikel' : 'Article',
        value: data.fields.article || '-',
      });
      fields.push({
        label: isGerman ? 'Verbesserungsvorschlag' : 'Suggestion',
        value: data.fields.suggestion || '-',
      });
      break;
  }
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1c1917; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #f7931a 0%, #e8850f 100%); padding: 24px; border-radius: 8px 8px 0 0;">
    <h1 style="color: #1c1917; margin: 0; font-size: 20px; font-weight: 600;">
      ${isGerman ? 'Neuer Beitrag' : 'New Submission'}
    </h1>
    <p style="color: #1c1917; margin: 8px 0 0; opacity: 0.8;">
      ${label}
    </p>
  </div>
  
  <div style="background: #fafaf9; padding: 24px; border: 1px solid #e7e5e4; border-top: none;">
    ${fields.map(field => `
      <div style="margin-bottom: 20px;">
        <p style="color: #78716c; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 4px;">
          ${field.label}
        </p>
        <p style="margin: 0; color: #1c1917; white-space: pre-wrap;">
          ${field.value.replace(/\n/g, '<br>')}
        </p>
      </div>
    `).join('')}
    
    <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 24px 0;">
    
    <div style="margin-bottom: 0;">
      <p style="color: #78716c; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 4px;">
        ${isGerman ? 'Kontakt-Email' : 'Contact Email'}
      </p>
      <p style="margin: 0; color: #1c1917;">
        ${data.userEmail ? `<a href="mailto:${data.userEmail}" style="color: #f7931a;">${data.userEmail}</a>` : (isGerman ? 'Nicht angegeben' : 'Not provided')}
      </p>
    </div>
  </div>
  
  <div style="background: #1c1917; padding: 16px 24px; border-radius: 0 0 8px 8px;">
    <p style="color: #a8a29e; font-size: 12px; margin: 0; text-align: center;">
      ${isGerman ? 'Gesendet über' : 'Sent via'} 
      <a href="https://thereforbitcoin.com" style="color: #f7931a; text-decoration: none;">thereforbitcoin.com</a>
      · ${data.locale.toUpperCase()}
    </p>
  </div>
</body>
</html>
  `.trim();
}
