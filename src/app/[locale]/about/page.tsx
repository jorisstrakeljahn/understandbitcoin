import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { User, Lightbulb, Scale, BookOpen, Globe, ArrowRight, ExternalLink } from '@/components/icons';
import styles from './about.module.css';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  
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

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'about' });
  const isGerman = locale === 'de';

  const values = [
    {
      icon: Lightbulb,
      title: isGerman ? 'Klarheit' : 'Clarity',
      description: isGerman
        ? 'Komplexe Themen einfach erklären, ohne zu vereinfachen.'
        : 'Explain complex topics simply, without oversimplifying.',
    },
    {
      icon: Scale,
      title: isGerman ? 'Fairness' : 'Fairness',
      description: isGerman
        ? 'Kritik ernst nehmen und ehrlich behandeln.'
        : 'Take criticism seriously and treat it honestly.',
    },
    {
      icon: BookOpen,
      title: isGerman ? 'Quellen' : 'Sources',
      description: isGerman
        ? 'Jede Behauptung mit Primärquellen belegen.'
        : 'Back every claim with primary sources.',
    },
    {
      icon: Globe,
      title: isGerman ? 'Zugänglichkeit' : 'Accessibility',
      description: isGerman
        ? 'Kostenlos, open-source und für alle verfügbar.'
        : 'Free, open-source, and available to everyone.',
    },
  ];

  return (
    <div className={styles.page} data-testid="about-page">
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title} data-testid="about-title">{t('title')}</h1>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </header>

        <div className={styles.content}>
          {/* Who's behind this */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <User size={20} />
              <h2>{t('whoAmI')}</h2>
            </div>
            <div className={styles.prose}>
              <p>
                {isGerman 
                  ? 'Hallo! Ich bin Joris, der Gründer von Therefor Bitcoin. Ich bin leidenschaftlich daran interessiert, Bitcoin verständlich zu machen — ohne Hype, ohne Propaganda, einfach mit klaren Antworten und soliden Quellen.'
                  : 'Hello! I\'m Joris, the founder of Therefor Bitcoin. I\'m passionate about making Bitcoin understandable — without hype, without propaganda, just clear answers and solid sources.'}
              </p>
              <p>
                {isGerman
                  ? 'Mein Weg zu Bitcoin begann mit Skepsis. Ich hörte die Kritik — "Es ist ein Ponzi-Schema", "Es verschwendet Energie", "Es wird nur von Kriminellen benutzt" — und wollte herausfinden, was wirklich stimmt. Was ich fand, hat meine Sicht auf Geld, Wirtschaft und Freiheit grundlegend verändert.'
                  : 'My journey to Bitcoin started with skepticism. I heard the criticisms — "It\'s a Ponzi scheme", "It wastes energy", "It\'s only used by criminals" — and wanted to find out what was really true. What I discovered fundamentally changed my view on money, economics, and freedom.'}
              </p>
            </div>
          </section>

          {/* Why this project */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Lightbulb size={20} />
              <h2>{t('whyThisProject')}</h2>
            </div>
            <div className={styles.prose}>
              <p>
                {isGerman
                  ? 'Die meisten Bitcoin-Ressourcen sind entweder zu technisch, zu oberflächlich oder zu sehr Propaganda. Ich wollte etwas anderes: eine Wissensdatenbank, die ehrlich mit Kritik umgeht, Nuancen anerkennt und alles mit Primärquellen belegt.'
                  : 'Most Bitcoin resources are either too technical, too superficial, or too much propaganda. I wanted something different: a knowledge base that deals honestly with criticism, acknowledges nuance, and backs everything with primary sources.'}
              </p>
              <p>
                {isGerman
                  ? 'Therefor Bitcoin ist mein Versuch, die Ressource zu bauen, die ich mir gewünscht hätte, als ich anfing, Bitcoin zu verstehen. Jeder Artikel wird sorgfältig recherchiert, fair geschrieben und mit echten Quellen belegt.'
                  : 'Therefor Bitcoin is my attempt to build the resource I wish I had when I started understanding Bitcoin. Every article is carefully researched, fairly written, and backed by real sources.'}
              </p>
            </div>
          </section>

          {/* Values */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Scale size={20} />
              <h2>{t('ourValues')}</h2>
            </div>
            <div className={styles.valuesGrid}>
              {values.map((value) => {
                const IconComponent = value.icon;
                return (
                  <div key={value.title} className={styles.valueCard}>
                    <div className={styles.valueIcon}>
                      <IconComponent size={20} />
                    </div>
                    <div className={styles.valueContent}>
                      <h3>{value.title}</h3>
                      <p>{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Open Source */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <BookOpen size={20} />
              <h2>{t('openSource')}</h2>
            </div>
            <div className={styles.prose}>
              <p>
                {isGerman
                  ? 'Therefor Bitcoin ist vollständig open-source. Der gesamte Code und alle Inhalte sind auf GitHub verfügbar. Du kannst Fehler melden, Verbesserungen vorschlagen oder selbst zum Projekt beitragen.'
                  : 'Therefor Bitcoin is completely open-source. All code and content is available on GitHub. You can report bugs, suggest improvements, or contribute to the project yourself.'}
              </p>
            </div>
            <div className={styles.actions}>
              <Link href={`/${locale}/contribute`}>
                <Button variant="outline" rightIcon={<ArrowRight size={16} />}>
                  {isGerman ? 'Zum Projekt beitragen' : 'Contribute to the Project'}
                </Button>
              </Link>
              <a 
                href="https://github.com/jorisstrakeljahn/thereforbitcoin"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" rightIcon={<ExternalLink size={16} />}>
                  GitHub
                </Button>
              </a>
            </div>
          </section>

          {/* Contact */}
          <section className={styles.contactSection}>
            <h2>{t('contact')}</h2>
            <p>
              {isGerman
                ? 'Hast du Fragen, Feedback oder Ideen? Ich freue mich über jede Nachricht!'
                : 'Have questions, feedback, or ideas? I\'d love to hear from you!'}
            </p>
            <div className={styles.contactLinks}>
              <a href="mailto:hello@thereforbitcoin.com" className={styles.contactLink}>
                <span className={styles.contactLabel}>Email</span>
                <span className={styles.contactValue}>hello@thereforbitcoin.com</span>
              </a>
              <a 
                href="https://github.com/jorisstrakeljahn/thereforbitcoin" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                <span className={styles.contactLabel}>GitHub</span>
                <span className={styles.contactValue}>@jorisstrakeljahn</span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
