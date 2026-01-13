import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { 
  FileText, 
  AlertCircle, 
  Code, 
  Languages, 
  ArrowRight, 
  ExternalLink,
  Check,
  X
} from '@/components/icons';
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

  const contributions = [
    {
      icon: FileText,
      title: isGerman ? 'Artikel vorschlagen' : 'Suggest Articles',
      description: isGerman
        ? 'Hast du eine Frage, die noch nicht beantwortet wurde? Schlage ein neues Thema vor.'
        : 'Have a question that hasn\'t been answered? Suggest a new topic.',
      href: 'https://github.com/jorisstrakeljahn/thereforbitcoin/issues/new?template=article_suggestion.md',
      label: isGerman ? 'Vorschlagen' : 'Suggest',
    },
    {
      icon: AlertCircle,
      title: isGerman ? 'Fehler melden' : 'Report Issues',
      description: isGerman
        ? 'Hast du einen Fehler gefunden? Ist eine Information nicht korrekt?'
        : 'Found a bug? Is some information incorrect?',
      href: 'https://github.com/jorisstrakeljahn/thereforbitcoin/issues/new?template=bug_report.md',
      label: isGerman ? 'Melden' : 'Report',
    },
    {
      icon: Code,
      title: isGerman ? 'Inhalte verbessern' : 'Improve Content',
      description: isGerman
        ? 'Du hast bessere Formulierungen oder zusätzliche Quellen?'
        : 'Have better wording or additional sources?',
      href: 'https://github.com/jorisstrakeljahn/thereforbitcoin/pulls',
      label: isGerman ? 'Bearbeiten' : 'Edit',
    },
    {
      icon: Languages,
      title: isGerman ? 'Übersetzen' : 'Translate',
      description: isGerman
        ? 'Sprichst du eine andere Sprache? Hilf uns, global zu werden.'
        : 'Speak another language? Help us go global.',
      href: 'https://github.com/jorisstrakeljahn/thereforbitcoin/issues/new?template=translation.md',
      label: isGerman ? 'Übersetzen' : 'Translate',
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
          {/* Contribution Cards */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {isGerman ? 'Wie du beitragen kannst' : 'Ways to Contribute'}
            </h2>
            <div className={styles.contributionGrid}>
              {contributions.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a 
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contributionCard}
                  >
                    <div className={styles.cardIcon}>
                      <IconComponent size={20} />
                    </div>
                    <div className={styles.cardContent}>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <span className={styles.cardAction}>
                      {item.label} <ExternalLink size={14} />
                    </span>
                  </a>
                );
              })}
            </div>
          </section>

          {/* Submit Suggestion */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {isGerman ? 'Artikelvorschlag einreichen' : 'Submit Article Suggestion'}
            </h2>
            <div className={styles.suggestionBox}>
              <p className={styles.suggestionIntro}>
                {isGerman
                  ? 'Möchtest du einen Artikel vorschlagen? Teile uns folgende Informationen mit:'
                  : 'Want to suggest an article? Share the following information:'}
              </p>
              <ul className={styles.suggestionList}>
                <li>
                  <strong>{isGerman ? 'Thema/Frage' : 'Topic/Question'}:</strong>{' '}
                  {isGerman ? 'Was soll behandelt werden?' : 'What should be covered?'}
                </li>
                <li>
                  <strong>{isGerman ? 'Relevanz' : 'Relevance'}:</strong>{' '}
                  {isGerman ? 'Warum ist das wichtig?' : 'Why is this important?'}
                </li>
                <li>
                  <strong>{isGerman ? 'Zielgruppe' : 'Target audience'}:</strong>{' '}
                  {isGerman ? 'Anfänger, Fortgeschrittene oder Experten?' : 'Beginner, intermediate, or advanced?'}
                </li>
                <li>
                  <strong>{isGerman ? 'Quellen' : 'Sources'}:</strong>{' '}
                  {isGerman ? 'Kennst du bereits gute Quellen?' : 'Know any good sources?'}
                </li>
              </ul>
              <div className={styles.suggestionActions}>
                <a href={`mailto:hello@thereforbitcoin.com?subject=${isGerman ? 'Artikelvorschlag' : 'Article Suggestion'}`}>
                  <Button variant="outline" rightIcon={<ArrowRight size={16} />}>
                    {isGerman ? 'Per E-Mail senden' : 'Send via Email'}
                  </Button>
                </a>
                <a 
                  href="https://github.com/jorisstrakeljahn/thereforbitcoin/issues/new?template=article_suggestion.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" rightIcon={<ExternalLink size={16} />}>
                    GitHub Issue
                  </Button>
                </a>
              </div>
            </div>
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
