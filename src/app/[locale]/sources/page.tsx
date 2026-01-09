import { setRequestLocale, getTranslations } from 'next-intl/server';
import { FileText, BookOpen, Video, GraduationCap, ArrowRight } from '@/components/icons';
import styles from './sources.module.css';

interface SourcesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: SourcesPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sources' });
  
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function SourcesPage({ params }: SourcesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'sources' });

  const CATEGORIES = [
    { 
      icon: FileText, 
      label: t('whitepapers'), 
      count: 12 
    },
    { 
      icon: GraduationCap, 
      label: t('academic'), 
      count: 24 
    },
    { 
      icon: BookOpen, 
      label: t('books'), 
      count: 18 
    },
    { 
      icon: Video, 
      label: t('videos'), 
      count: 30 
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
          <div className={styles.comingSoonIcon}>📚</div>
          <h2>{t('comingSoon')}</h2>
          <p>{t('description')}</p>
        </div>

        <div className={styles.preview}>
          <h3 className={styles.categoriesTitle}>{t('categories')}</h3>
          <div className={styles.categoriesGrid}>
            {CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.label} className={styles.categoryCard}>
                  <div className={styles.categoryIcon}>
                    <IconComponent size={24} />
                  </div>
                  <span className={styles.categoryLabel}>{category.label}</span>
                  <span className={styles.categoryCount}>{category.count}</span>
                </div>
              );
            })}
          </div>
          
          <button className={styles.browseButton} disabled>
            {t('browseAll')} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
