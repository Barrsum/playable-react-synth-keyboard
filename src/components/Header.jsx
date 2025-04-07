import React from 'react';
import ThemeToggle from './ThemeToggle'; // Import the toggle
import './Header.css';

// Receive props from App component
function Header({ currentTheme, onToggleTheme }) {
  return (
    <header className="app-header">
      <div className="title-credit">
      <h1 className="app-title">Synth Keyboard</h1>
      <h1 className="app-title2">- Created By Ram Bapat -</h1>
      </div>
      <div>
      {/* Use the ThemeToggle component */}
      <ThemeToggle theme={currentTheme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}

export default Header;

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos