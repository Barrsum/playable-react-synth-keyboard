// src/components/Key.jsx
import React from 'react';
import './Key.css'; // Styles derived from HTML example

// Receive note, keyboardKey, sargamLabel, isBlack, isActive
// Receive onAttack and onRelease handlers
function Key({ note, keyboardKey, sargamLabel, isBlack, isActive, onAttack, onRelease }) {

  const keyClassName = `
    key
    ${isBlack ? 'black' : 'white'}
    ${isActive ? 'active' : ''}
  `;

  // Handlers for starting note playback
  const handleInteractionStart = (event) => {
    // Prevent default touch behavior like scrolling or unwanted clicks
    if (event.type === 'touchstart') event.preventDefault();
    onAttack(note); // Call the attack handler passed from App
  };

  // Handlers for stopping note playback
  const handleInteractionEnd = (event) => {
    // Check if the event target is the key itself or if the type implies release
    if (event.type === 'touchend' || event.type === 'touchcancel' || event.type === 'mouseup' || event.type === 'mouseleave') {
        if(event.type === 'touchend' || event.type === 'touchcancel') event.preventDefault();
        // Only call release if the note is currently considered active by parent (optional check)
        // or just call it regardless, App's noteRelease handles if it was actually held
        onRelease(note); // Call the release handler passed from App
    }
  };

  return (
    <div
      className={keyClassName}
      onMouseDown={handleInteractionStart}
      onTouchStart={handleInteractionStart}
      // Add handlers for release events
      onMouseUp={handleInteractionEnd}
      onMouseLeave={handleInteractionEnd} // Stop note if mouse leaves while pressed
      onTouchEnd={handleInteractionEnd}
      onTouchCancel={handleInteractionEnd} // Handle cancelled touches
      // Add data attributes mirroring HTML example (useful for CSS/debugging)
      data-note={note}
      data-key={keyboardKey}
    >
      {/* Container for labels, positioned using Flexbox in CSS */}
      <div className="key-label-container">
        {/* Display Sargam label if it exists (only on white keys via CSS) */}
        {sargamLabel && <span className="key-sargam-label">{sargamLabel}</span>}
        <span className="key-note-label">{note}</span>
        {/* Display keyboard key mapping */}
        <span className="key-kbd-label">{keyboardKey?.toUpperCase()}</span>
      </div>
    </div>
  );
}

export default Key;

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos