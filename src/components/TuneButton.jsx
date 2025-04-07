// src/components/TuneButton.jsx
import React from 'react';
import './TuneButton.css';

function TuneButton({ tuneName, onPlayTune, isPlaying }) {
  return (
    <button
      className="tune-button"
      onClick={onPlayTune}
      disabled={isPlaying} // Disable button while a tune is playing
    >
      {tuneName}
    </button>
  );
}

export default TuneButton;

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos