'use client';

import { useState, useRef, useCallback, useEffect, ReactNode, useSyncExternalStore } from 'react';
import { ChevronLeft, ChevronRight } from '@/components/icons';
import styles from './ResizableSidebar.module.css';

interface ResizableSidebarProps {
  children: ReactNode;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  storageKey?: string;
  collapsedStorageKey?: string;
}

// Hook to read initial value from localStorage without causing hydration issues
function useLocalStorageValue<T>(key: string, defaultValue: T, parse: (val: string | null) => T): T {
  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return defaultValue;
    return parse(localStorage.getItem(key));
  }, [key, defaultValue, parse]);

  const getServerSnapshot = useCallback(() => defaultValue, [defaultValue]);

  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener('storage', callback);
    return () => window.removeEventListener('storage', callback);
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function ResizableSidebar({
  children,
  defaultWidth = 280,
  minWidth = 200,
  maxWidth = 450,
  storageKey = 'sidebar-width',
  collapsedStorageKey = 'sidebar-collapsed',
}: ResizableSidebarProps) {
  // Read initial values from localStorage using useSyncExternalStore
  const initialWidth = useLocalStorageValue(
    storageKey,
    defaultWidth,
    useCallback((val: string | null) => {
      if (!val) return defaultWidth;
      const parsed = parseInt(val, 10);
      return (parsed >= minWidth && parsed <= maxWidth) ? parsed : defaultWidth;
    }, [defaultWidth, minWidth, maxWidth])
  );

  const initialCollapsed = useLocalStorageValue(
    collapsedStorageKey,
    false,
    useCallback((val: string | null) => val === 'true', [])
  );

  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Save width to localStorage
  useEffect(() => {
    if (!isResizing) {
      localStorage.setItem(storageKey, String(width));
    }
  }, [width, isResizing, storageKey]);

  // Save collapsed state
  useEffect(() => {
    localStorage.setItem(collapsedStorageKey, String(isCollapsed));
  }, [isCollapsed, collapsedStorageKey]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !sidebarRef.current) return;

      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const newWidth = e.clientX - sidebarRect.left;
      
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    },
    [isResizing, minWidth, maxWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={sidebarRef}
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
      style={{ width: isCollapsed ? '48px' : `${width}px` }}
      data-testid="resizable-sidebar"
    >
      {/* Collapse Toggle Button */}
      <button
        className={styles.collapseButton}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={isCollapsed ? 'Expand' : 'Collapse'}
        data-testid="resizable-sidebar-toggle"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Content */}
      <div className={`${styles.content} ${isCollapsed ? styles.contentHidden : ''}`} data-testid="resizable-sidebar-content">
        {children}
      </div>

      {/* Resizer (only visible when not collapsed) */}
      {!isCollapsed && (
        <div
          className={`${styles.resizer} ${isResizing ? styles.resizerActive : ''}`}
          onMouseDown={handleMouseDown}
          data-testid="resizable-sidebar-resizer"
        >
          <div className={styles.resizerHandle} />
        </div>
      )}
    </div>
  );
}
