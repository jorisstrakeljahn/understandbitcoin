import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  FileText, 
  AlertCircle, 
  Code, 
  Languages, 
  ArrowRight,
  Check,
  X
} from '@/components/icons';
import { Tabs, TabList, TabTrigger, TabContent } from '@/components/ui';
import { ContactForm } from '@/components/contribute';
import styles from './contribute.module.css';

interface ContributePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContributePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contribute' });
  
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    },
  };
}

export default async function ContributePage({ params }: ContributePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'contribute' });
  const isGerman = locale === 'de';

  const formTypes = [
    {
      id: 'article-suggestion',
      icon: FileText,
      title: isGerman ? 'Artikel vorschlagen' : 'Suggest Article',
      description: isGerman
        ? 'Hast du eine Frage, die noch nicht beantwortet wurde?'
        : 'Have a question that hasn\'t been answered yet?',
    },
    {
      id: 'bug-report',
      icon: AlertCircle,
      title: isGerman ? 'Fehler melden' : 'Report Issue',
      description: isGerman
        ? 'Hast du einen Fehler gefunden oder ist etwas falsch?'
        : 'Found a bug or something incorrect?',
    },
    {
      id: 'improvement',
      icon: Code,
      title: isGerman ? 'Inhalt verbessern' : 'Improve Content',
      description: isGerman
        ? 'Bessere Formulierungen oder zusätzliche Quellen?'
        : 'Better wording or additional sources?',
    },
    {
      id: 'translation',
      icon: Languages,
      title: isGerman ? 'Übersetzen' : 'Translate',
      description: isGerman
        ? 'Hilf uns, in weiteren Sprachen verfügbar zu sein.'
        : 'Help us become available in more languages.',
    },
  ];

  const dosAndDonts = {
    dos: isGerman 
      ? ['Klare, verständliche Sprache', 'Primärquellen für alle Behauptungen', 'Faire Behandlung von Kritik', 'Nuancierte Argumentation']
      : ['Clear, understandable language', 'Primary sources for all claims', 'Fair treatment of criticism', 'Nuanced argumentation'],
    donts: isGerman
      ? ['Propaganda oder Hype', 'Unbelegte Behauptungen', 'Abwertung anderer Projekte', 'Finanzberatung']
      : ['Propaganda or hype', 'Unsupported claims', 'Disparaging other projects', 'Financial advice'],
  };

  return (
    <div className={styles.page} data-testid="contribute-page">
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title} data-testid="contribute-title">{t('title')}</h1>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </header>

        <div className={styles.content}>
          {/* Form Tabs */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {isGerman ? 'Wie möchtest du beitragen?' : 'How would you like to contribute?'}
            </h2>
            
            <Tabs defaultValue="article-suggestion" className={styles.tabs}>
              <TabList className={styles.tabList}>
                {formTypes.map((form) => {
                  const IconComponent = form.icon;
                  return (
                    <TabTrigger key={form.id} value={form.id} className={styles.tabTrigger}>
                      <IconComponent size={18} />
                      <span className={styles.tabLabel}>{form.title}</span>
                    </TabTrigger>
                  );
                })}
              </TabList>
              
              {formTypes.map((form) => (
                <TabContent key={form.id} value={form.id} className={styles.tabContent}>
                  <div className={styles.formHeader}>
                    <p className={styles.formDescription}>{form.description}</p>
                  </div>
                  <ContactForm 
                    formType={form.id as 'article-suggestion' | 'bug-report' | 'improvement' | 'translation'} 
                    locale={locale} 
                  />
                </TabContent>
              ))}
            </Tabs>
          </section>

          {/* Writing Guidelines */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {isGerman ? 'Schreibrichtlinien' : 'Writing Guidelines'}
            </h2>
            <div className={styles.guidelinesGrid}>
              <div className={styles.guidelineCard}>
                <div className={styles.guidelineHeader}>
                  <Check size={18} />
                  <h3>{isGerman ? 'Was wir wollen' : 'What we want'}</h3>
                </div>
                <ul>
                  {dosAndDonts.dos.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={`${styles.guidelineCard} ${styles.guidelineCardDont}`}>
                <div className={styles.guidelineHeader}>
                  <X size={18} />
                  <h3>{isGerman ? 'Was wir vermeiden' : 'What we avoid'}</h3>
                </div>
                <ul>
                  {dosAndDonts.donts.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Thank You */}
          <section className={styles.thankYou}>
            <h2>{isGerman ? 'Danke für deine Unterstützung' : 'Thank you for your support'}</h2>
            <p>
              {isGerman
                ? 'Jeder Beitrag hilft, Bitcoin-Wissen für alle zugänglich zu machen.'
                : 'Every contribution helps make Bitcoin knowledge accessible to everyone.'}
            </p>
            <Link href={`/${locale}/about`} className={styles.aboutLink}>
              {isGerman ? 'Mehr über das Projekt' : 'More about the project'} <ArrowRight size={14} />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
