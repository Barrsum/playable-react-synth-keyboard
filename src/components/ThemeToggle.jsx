// src/components/ThemeToggle.jsx
import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi'; // Import icons
import './ThemeToggle.css';

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
        onClick={onToggle}
        className="theme-toggle-button"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
      {theme === 'dark' ? (
        <FiSun size="1.5em" /> // Show sun icon in dark mode
      ) : (
        <FiMoon size="1.5em" /> // Show moon icon in light mode
      )}
    </button>
  );
}

export default ThemeToggle;

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos