'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './AnimatedQuestion.module.css';

interface Question {
  text: string;
  slug: string;
}

interface AnimatedQuestionProps {
  questions: Question[];
  interval?: number;
  locale?: string;
}

export function AnimatedQuestion({ questions, interval = 4000, locale = 'en' }: AnimatedQuestionProps) {
  // Start with index 0 to avoid hydration mismatch (Math.random differs on server/client)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'waiting' | 'deleting'>('typing');
  const hasInitialized = useRef(false);

  const currentQuestion = questions[currentIndex];

  // Get random index that's different from current
  const getRandomIndex = useCallback(() => {
    if (questions.length <= 1) return 0;
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * questions.length);
    } while (newIndex === currentIndex);
    return newIndex;
  }, [questions.length, currentIndex]);

  // Set random initial index after mount (client-side only)
  useEffect(() => {
    if (!hasInitialized.current && questions.length > 1) {
      hasInitialized.current = true;
      // Use requestAnimationFrame to defer the state update
      requestAnimationFrame(() => {
        setCurrentIndex(Math.floor(Math.random() * questions.length));
      });
    }
  }, [questions.length]);

  // Typewriter effect - all setState calls are inside setTimeout callbacks
  useEffect(() => {
    if (!currentQuestion) return;

    const fullText = currentQuestion.text;
    let timeoutId: NodeJS.Timeout;

    if (phase === 'typing') {
      if (displayText.length < fullText.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(fullText.slice(0, displayText.length + 1));
        }, 50);
      } else {
        // Done typing, wait before deleting - use setTimeout to avoid sync setState
        timeoutId = setTimeout(() => {
          setPhase('waiting');
        }, 0);
      }
    } else if (phase === 'waiting') {
      timeoutId = setTimeout(() => {
        setPhase('deleting');
      }, interval);
    } else if (phase === 'deleting') {
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 30);
      } else {
        // Done deleting, move to next question - use setTimeout to avoid sync setState
        timeoutId = setTimeout(() => {
          setPhase('typing');
          setCurrentIndex(getRandomIndex());
        }, 0);
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [displayText, phase, currentQuestion, interval, getRandomIndex]);

  if (!currentQuestion) return null;

  return (
    <Link href={`/${locale}/articles/${currentQuestion.slug}`} className={styles.questionLink}>
      <span className={styles.questionText}>
        {displayText}
        <motion.span
          className={styles.cursor}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        >
          |
        </motion.span>
      </span>
    </Link>
  );
}
