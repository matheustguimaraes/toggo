import React from 'react';
import styles from './ThemeToggleButton.module.css';
import { useTheme } from '../contexts/ThemeContext';// Importe o hook

export default function ThemeToggleButton() {
  const { toggleTheme } = useTheme();

  return (
    <button
      className={styles.floatingButton}
      onClick={toggleTheme}
      title="Mudar tema"
      aria-label="Mudar tema"
    >
      🌓
    </button>
  );
}