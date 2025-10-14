import React from 'react';
import { useTheme } from '../../context/ThemeProvider';

export const ThemeToggle: React.FC = () => {
  const { theme, toggle } = useTheme();
  return (
    <button className="btn" onClick={toggle} aria-label="Toggle theme">
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};
