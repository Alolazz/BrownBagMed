"use client";

import { useTheme } from '../context/ThemeContext';
import styles from '../page.module.css';

export default function ThemeTestPage() {
  const { theme } = useTheme();
  
  return (
    <main className={styles.main}>
      <div style={{
        padding: '2rem',
        backgroundColor: 'var(--card-background)',
        borderRadius: '8px',
        boxShadow: '0 4px 8px var(--shadow)',
        maxWidth: '800px',
        margin: '2rem auto',
        textAlign: 'center'
      }}>
        <h1>Theme Toggle Test</h1>
        <p>Current theme: <strong>{theme}</strong></p>
        
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem',
          backgroundColor: theme === 'light' ? '#f0f4f8' : '#2a2a2a',
          color: theme === 'light' ? '#333' : '#f0f0f0',
          borderRadius: '4px'
        }}>
          <p>This is how content looks in the current theme.</p>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <p>Click the theme toggle button in the header to switch between light and dark mode.</p>
        </div>
      </div>
    </main>
  );
}
