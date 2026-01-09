'use client';

import { useEffect, useState, useCallback, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark' | 'system';

// Create a simple theme store
const themeStore = {
  theme: 'system' as Theme,
  listeners: new Set<() => void>(),
  
  getTheme() {
    if (typeof window === 'undefined') return 'system' as Theme;
    return (localStorage.getItem('theme') as Theme) || 'system';
  },
  
  setTheme(newTheme: Theme) {
    this.theme = newTheme;
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
    this.listeners.forEach((listener) => listener());
  },
  
  subscribe(listener: () => void) {
    themeStore.listeners.add(listener);
    return () => themeStore.listeners.delete(listener);
  },
  
  getSnapshot() {
    if (typeof window === 'undefined') return 'system' as Theme;
    return (localStorage.getItem('theme') as Theme) || 'system';
  },
  
  getServerSnapshot() {
    return 'system' as Theme;
  },
};

// Hook to detect if we're on the client
function useHasMounted() {
  const getSnapshot = useCallback(() => true, []);
  const getServerSnapshot = useCallback(() => false, []);
  const subscribe = useCallback(() => () => {}, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useTheme() {
  const mounted = useHasMounted();
  
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot
  );
  
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      let resolved: 'light' | 'dark';
      
      if (theme === 'system') {
        resolved = mediaQuery.matches ? 'dark' : 'light';
        root.removeAttribute('data-theme');
      } else {
        resolved = theme;
        root.setAttribute('data-theme', theme);
      }
      
      setResolvedTheme(resolved);
    };

    updateTheme();

    const handleChange = () => {
      if (theme === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  const setTheme = useCallback((newTheme: Theme) => {
    themeStore.setTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }, [resolvedTheme, setTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    mounted,
  };
}
