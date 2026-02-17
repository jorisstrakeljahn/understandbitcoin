import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
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
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'about' });
  const isGerman = locale === 'de';

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </header>

        <div className={styles.content}>
          {/* Who's behind this */}
          <section className={styles.section}>
            <h2>{isGerman ? 'Wer steckt dahinter?' : "Who's behind this?"}</h2>
            <p>
              {isGerman 
                ? 'Hallo! Ich bin Joris. Ich bin leidenschaftlich daran interessiert, Bitcoin verständlich zu machen — ohne Hype, ohne Propaganda, einfach mit klaren Antworten und soliden Quellen.'
                : "Hello! I'm Joris. I'm passionate about making Bitcoin understandable — without hype, without propaganda, just clear answers and solid sources."}
            </p>
            <p>
              {isGerman
                ? 'Mein Weg zu Bitcoin begann mit Skepsis. Ich hörte die Kritik und wollte herausfinden, was wirklich stimmt. Was ich fand, hat meine Sicht auf Geld, Wirtschaft und Freiheit grundlegend verändert.'
                : "My journey to Bitcoin started with skepticism. I heard the criticisms and wanted to find out what was really true. What I discovered fundamentally changed my view on money, economics, and freedom."}
            </p>
          </section>

          {/* Why this project */}
          <section className={styles.section}>
            <h2>{isGerman ? 'Warum dieses Projekt?' : 'Why this project?'}</h2>
            <p>
              {isGerman
                ? 'Die meisten Bitcoin-Ressourcen sind entweder zu technisch, zu oberflächlich oder zu propagandistisch. Therefor Bitcoin ist mein Versuch, die Ressource zu bauen, die ich mir gewünscht hätte — sorgfältig recherchiert, fair geschrieben und mit echten Quellen belegt.'
                : "Most Bitcoin resources are either too technical, too superficial, or too much propaganda. Therefor Bitcoin is my attempt to build the resource I wish I had — carefully researched, fairly written, and backed by real sources."}
            </p>
          </section>

          {/* Contact */}
          <section className={styles.section}>
            <h2>{isGerman ? 'Kontakt & Mitwirken' : 'Contact & Contribute'}</h2>
            <p>
              {isGerman
                ? 'Hast du Fragen, Feedback oder möchtest du zum Projekt beitragen? Schreib mir einfach eine E-Mail. Das Projekt ist open-source auf GitHub — du kannst auch dort Fehler melden oder Verbesserungen vorschlagen.'
                : "Have questions, feedback, or want to contribute? Just send me an email. The project is open-source on GitHub — you can also report issues or suggest improvements there."}
            </p>
            <div className={styles.contactLinks}>
              <a href="mailto:joris.strakeljahn@web.de" className={styles.contactLink}>
                <span className={styles.contactLabel}>Email</span>
                <span className={styles.contactValue}>joris.strakeljahn@web.de</span>
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
