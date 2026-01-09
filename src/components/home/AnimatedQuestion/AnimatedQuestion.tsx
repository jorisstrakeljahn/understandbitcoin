'use client';

import { useState, useEffect, useCallback } from 'react';
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
}

export function AnimatedQuestion({ questions, interval = 4000 }: AnimatedQuestionProps) {
  const [currentIndex, setCurrentIndex] = useState(() => 
    Math.floor(Math.random() * questions.length)
  );
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

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
    <Link href={`/articles/${currentQuestion.slug}`} className={styles.questionLink}>
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
