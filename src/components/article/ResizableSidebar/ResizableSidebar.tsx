'use client';

import { useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ResizableSidebar.module.css';

interface ResizableSidebarProps {
  children: ReactNode;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  storageKey?: string;
  collapsedStorageKey?: string;
}

export function ResizableSidebar({
  children,
  defaultWidth = 280,
  minWidth = 200,
  maxWidth = 450,
  storageKey = 'sidebar-width',
  collapsedStorageKey = 'sidebar-collapsed',
}: ResizableSidebarProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Load saved width and collapsed state from localStorage
  useEffect(() => {
    const savedWidth = localStorage.getItem(storageKey);
    if (savedWidth) {
      const parsed = parseInt(savedWidth, 10);
      if (parsed >= minWidth && parsed <= maxWidth) {
        setWidth(parsed);
      }
    }
    
    const savedCollapsed = localStorage.getItem(collapsedStorageKey);
    if (savedCollapsed === 'true') {
      setIsCollapsed(true);
    }
  }, [storageKey, collapsedStorageKey, minWidth, maxWidth]);

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
    >
      {/* Collapse Toggle Button */}
      <button
        className={styles.collapseButton}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={isCollapsed ? 'Expand' : 'Collapse'}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Content */}
      <div className={`${styles.content} ${isCollapsed ? styles.contentHidden : ''}`}>
        {children}
      </div>

      {/* Resizer (only visible when not collapsed) */}
      {!isCollapsed && (
        <div
          className={`${styles.resizer} ${isResizing ? styles.resizerActive : ''}`}
          onMouseDown={handleMouseDown}
        >
          <div className={styles.resizerHandle} />
        </div>
      )}
    </div>
  );
}
