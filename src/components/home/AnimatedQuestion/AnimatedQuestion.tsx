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
  const [isDeleting, setIsDeleting] = useState(false);
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

  // Set random initial index after hydration (client-side only)
  useEffect(() => {
    if (!hasInitialized.current && questions.length > 1) {
      hasInitialized.current = true;
      setCurrentIndex(Math.floor(Math.random() * questions.length));
    }
  }, [questions.length]);

  useEffect(() => {
    if (!currentQuestion) return;

    const fullText = currentQuestion.text;
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing
      if (displayText.length < fullText.length) {
        timeout = setTimeout(() => {
          setDisplayText(fullText.slice(0, displayText.length + 1));
        }, 50); // Typing speed
      } else {
        // Done typing, wait before deleting
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, interval);
      }
    } else {
      // Deleting
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 30); // Deleting speed (faster)
      } else {
        // Done deleting, move to random question
        setIsDeleting(false);
        setCurrentIndex(getRandomIndex());
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentQuestion, interval, getRandomIndex]);

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
