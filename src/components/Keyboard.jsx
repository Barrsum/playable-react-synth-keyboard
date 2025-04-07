// src/components/Keyboard.jsx
import React from 'react';
import Key from './Key';
import { notes } from '../data/keyboardLayout'; // Your note layout data
import './Keyboard.css'; // Link to the updated styles

// Receive activeKeys state, onAttack, and onRelease handlers from App
function Keyboard({ activeKeys, onAttack, onRelease }) {
  return (
    <div className="keyboard-container"> {/* Outer container for scrolling */}
        <div className="keyboard"> {/* The actual keyboard frame */}
            {notes.map((noteData) => (
            <Key
                key={noteData.note} // Unique identifier
                note={noteData.note}
                keyboardKey={noteData.key} // Pass the keyboard key label
                sargamLabel={noteData.sargam} // Pass sargam label
                isBlack={noteData.isBlack}
                isActive={activeKeys.has(noteData.note)} // Check if note is active
                onAttack={onAttack}     // Pass attack handler
                onRelease={onRelease}   // Pass release handler
            />
            ))}
        </div>
    </div>
  );
}

export default Keyboard;

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos