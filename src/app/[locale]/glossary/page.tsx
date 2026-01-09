import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Search, ArrowRight } from '@/components/icons';
import styles from './glossary.module.css';

interface GlossaryPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: GlossaryPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'glossary' });
  
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function GlossaryPage({ params }: GlossaryPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'glossary' });

  const SAMPLE_TERMS = [
    { 
      term: 'Bitcoin', 
      definition: locale === 'de' 
        ? 'Eine dezentrale digitale Währung ohne zentrale Bank oder Administrator.' 
        : 'A decentralized digital currency without a central bank or administrator.' 
    },
    { 
      term: 'Blockchain', 
      definition: locale === 'de' 
        ? 'Eine verteilte Datenbank, die eine ständig wachsende Liste von Datensätzen pflegt.'
        : 'A distributed database that maintains a continuously growing list of records.' 
    },
    { 
      term: 'Satoshi', 
      definition: locale === 'de' 
        ? 'Die kleinste Einheit eines Bitcoin, gleich 0,00000001 BTC.'
        : 'The smallest unit of a bitcoin, equal to 0.00000001 BTC.' 
    },
    { 
      term: 'HODL', 
      definition: locale === 'de' 
        ? 'Ein Meme-basierter Begriff für das langfristige Halten von Bitcoin.'
        : 'A meme-based term for holding Bitcoin for the long term.' 
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </header>

        <div className={styles.comingSoon}>
          <div className={styles.comingSoonIcon}>📖</div>
          <h2>{t('comingSoon')}</h2>
          <p>{t('description')}</p>
        </div>

        <div className={styles.preview}>
          <div className={styles.searchPreview}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')} 
              disabled 
              className={styles.searchInput}
            />
          </div>

          <div className={styles.termsPreview}>
            <h3>{t('featuredTerms')}</h3>
            <div className={styles.termsList}>
              {SAMPLE_TERMS.map((item) => (
                <div key={item.term} className={styles.termCard}>
                  <h4 className={styles.termName}>{item.term}</h4>
                  <p className={styles.termDefinition}>{item.definition}</p>
                </div>
              ))}
            </div>
            <button className={styles.viewAllButton} disabled>
              {t('viewAll')} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
