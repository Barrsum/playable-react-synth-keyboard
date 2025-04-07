import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import Keyboard from './components/Keyboard';
import TuneButton from './components/TuneButton';
import Footer from './components/Footer';
import * as Tone from 'tone';
// Import maps and note data
import { keyToNoteMap, noteToDataMap, notes as allNotesData } from './data/keyboardLayout';
import { tunes } from './data/tunes';
import './App.css'; // Import App specific styles

function App() {
  // === State Variables ===
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'
  const [activeNotes, setActiveNotes] = useState(new Set()); // Notes visually active
  const [isAudioReady, setIsAudioReady] = useState(false); // Tracks if Tone.js context is running
  const [isPlayingTune, setIsPlayingTune] = useState(false); // Tracks if a preset tune is playing

  // === Refs ===
  const synth = useRef(null); // Holds the Tone.js synth instance
  const userHeldNotes = useRef(new Set()); // Tracks notes currently held down by USER interaction
  const currentPart = useRef(null); // Holds the current Tone.Part for tune playback

  // === Theme Handling ===
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  // Effect to apply theme class to body and update CSS variables
  useEffect(() => {
    const bodyClass = theme === 'light' ? 'light-theme' : '';
    document.body.className = bodyClass;
    const root = document.documentElement;
    const themeSuffix = theme === 'light' ? 'light' : 'dark';
    const setVar = (varName, value) => root.style.setProperty(varName, value);

    // Base App Styles
    setVar('--bg-color', `var(--bg-color-${themeSuffix})`);
    setVar('--text-color', `var(--text-color-${themeSuffix})`);
    // Header Styles
    setVar('--header-bg', `var(--header-bg-${themeSuffix})`);
    setVar('--header-text', `var(--header-text-${themeSuffix})`);
    setVar('--header-border', `var(--header-border-${themeSuffix})`);
    // Button Styles
    setVar('--button-bg', `var(--button-bg-${themeSuffix})`);
    setVar('--button-text', `var(--button-text-${themeSuffix})`);
    // Keyboard specific theme vars
    setVar('--key-white-bg', `var(--key-white-bg-${themeSuffix})`);
    setVar('--key-white-bg-active', `var(--key-white-bg-active-${themeSuffix})`);
    setVar('--key-black-bg', `var(--key-black-bg-${themeSuffix})`);
    setVar('--key-black-bg-active', `var(--key-black-bg-active-${themeSuffix})`);
    setVar('--key-border', `var(--key-border-${themeSuffix})`);
    setVar('--key-shadow', `var(--key-shadow-${themeSuffix})`);
    setVar('--key-shadow-active', `var(--key-shadow-active-${themeSuffix})`);
    setVar('--glow-color', `var(--glow-color-${themeSuffix})`);
    setVar('--key-label-color', `var(--key-label-color-${themeSuffix})`);
    setVar('--kbd-label-color', `var(--kbd-label-color-${themeSuffix})`);
    setVar('--sargam-label-color', `var(--sargam-label-color-${themeSuffix})`);
    setVar('--key-label-color-black-key', `var(--key-label-color-black-key-${themeSuffix})`);
    setVar('--kbd-label-color-black-key', `var(--kbd-label-color-black-key-${themeSuffix})`);
    setVar('--keyboard-bg', `var(--keyboard-bg-${themeSuffix})`);
    setVar('--keyboard-shadow', `var(--keyboard-shadow-${themeSuffix})`);
    setVar('--black-key-border-color', `var(--black-key-border-color-${themeSuffix})`);
    // Footer Styles
    setVar('--footer-bg', `var(--footer-bg-${themeSuffix})`);
    setVar('--footer-text-color', `var(--footer-text-color-${themeSuffix})`);
    setVar('--footer-border-color', `var(--footer-border-color-${themeSuffix})`);
    setVar('--footer-link-color', `var(--footer-link-color-${themeSuffix})`);
    setVar('--footer-link-hover-color', `var(--footer-link-hover-color-${themeSuffix})`);

  }, [theme]);

  // === Audio Initialization (Attempt on Load, Fallback on Interaction) ===
  const initializeAudio = useCallback(async (isUserInteraction = false) => {
     if (isAudioReady) return; // Already initialized

    try {
        // Tone.start() attempts to resume the context. It's often better to call
        // it closer to the actual user interaction if possible, but we'll try here.
        // Browsers might still require a gesture.
        if (Tone.context.state !== 'running') {
            console.log("Attempting to start AudioContext...");
            // This might fail silently if called without a user gesture initially
            await Tone.start();
             // Check state *after* attempting to start
             if (Tone.context.state === 'running') {
                 console.log('AudioContext started successfully!');
             } else if (isUserInteraction) {
                 console.log('AudioContext started after user interaction.');
             } else {
                 console.warn('AudioContext suspended. User interaction likely needed.');
                 // Don't set isAudioReady true yet if it didn't start
                 return; // Exit if context didn't start and it wasn't triggered by user
             }
        }

        // Create the synth only if it doesn't exist AND context is running
        if (Tone.context.state === 'running' && !synth.current) {
            synth.current = new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'fatsawtooth', count: 3, spread: 20 },
                envelope: { attack: 0.02, decay: 0.1, sustain: 0.7, release: 0.3 },
            }).toDestination();
            console.log("Synth created.");
        }

        // Only set ready if context is truly running
        if(Tone.context.state === 'running') {
            setIsAudioReady(true);
            console.log("Audio system is ready.");
        }

    } catch (error) {
        console.error("Error initializing audio:", error);
    }
  }, [isAudioReady]); // isAudioReady dependency is important


   // --- Attempt to initialize audio automatically on component mount ---
   useEffect(() => {
       // Don't await here, let it run in the background
       initializeAudio(false); // false indicates it's not a direct user interaction
   }, [initializeAudio]); // Run once on mount


  // === Note Playback (Attack/Release for Sustain) ===
  const noteAttack = useCallback((note) => {
    // Check if audio is ready, if not, TRY to initialize (as user interaction)
    if (!isAudioReady) {
      console.log("Audio not ready, attempting initialization on interaction...");
      // Pass true to indicate this is triggered by user interaction
      initializeAudio(true).then(() => {
          // After attempting init, check again and play if ready
           if (isAudioReady && synth.current && !isPlayingTune) {
               console.log('(Post-Init) Attack:', note);
               synth.current.triggerAttack(note, Tone.now());
               setActiveNotes(prev => new Set(prev).add(note));
               userHeldNotes.current.add(note);
           } else {
               console.warn("Failed to play note after interaction init attempt.");
           }
      });
      return; // Don't proceed further in this call, let the async init handle it
    }

    // If audio was already ready
    if (isPlayingTune) return; // Block manual play during tunes

    console.log('Attack:', note);
    synth.current.triggerAttack(note, Tone.now());
    setActiveNotes(prev => new Set(prev).add(note));
    userHeldNotes.current.add(note);

  }, [isAudioReady, isPlayingTune, initializeAudio]); // Add initializeAudio dependency

  const noteRelease = useCallback((note) => {
    // Check synth.current first to prevent errors if init failed
    if (synth.current && userHeldNotes.current.has(note)) {
        console.log('Release:', note);
        synth.current.triggerRelease(note, Tone.now() + 0.01);

        setActiveNotes(prev => {
            const newNotes = new Set(prev);
            newNotes.delete(note);
            return newNotes;
        });
        userHeldNotes.current.delete(note);
    }
  }, []);


  // === Computer Keyboard Input Handling ===
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.repeat) return;
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) return;
      const note = keyToNoteMap[event.key.toLowerCase()];
       if (note && !userHeldNotes.current.has(note)) {
            event.preventDefault();
            noteAttack(note);
       }
    };
    const handleKeyUp = (event) => {
       if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) return;
      const note = keyToNoteMap[event.key.toLowerCase()];
      if (note) {
        event.preventDefault();
        noteRelease(note);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
       userHeldNotes.current.forEach(note => {
            if(synth.current) synth.current.triggerRelease(note, Tone.now());
       });
       userHeldNotes.current.clear();
    };
  }, [noteAttack, noteRelease]);


  // === Tune Playback Logic ===
   const stopTune = useCallback(() => {
     if (!isPlayingTune) return;
     console.log("Stopping tune...");
     Tone.Transport.stop();
     Tone.Transport.cancel();
     if (currentPart.current) {
       currentPart.current.dispose();
       currentPart.current = null;
     }
     setActiveNotes(new Set());
     setIsPlayingTune(false);
   }, [isPlayingTune]);

  const playTune = useCallback(async (tuneData) => {
     // Ensure audio is ready (attempt init if not, passing true for interaction context)
     if (!isAudioReady) {
       console.log("Audio not ready for tune, attempting initialization...");
       await initializeAudio(true);
       if (!isAudioReady) { // Check again after attempt
         console.error("Cannot play tune - audio system failed to initialize.");
         alert("Audio couldn't start. Please try interacting with the keys first.");
         return;
       }
     }
     // If already playing, stop the current tune
     if (isPlayingTune) {
       stopTune();
       await new Promise(resolve => setTimeout(resolve, 50));
     }
     // Release any manually held notes
     userHeldNotes.current.forEach(note => noteRelease(note));
     userHeldNotes.current.clear();

     console.log("Starting tune...");
     setIsPlayingTune(true);

     currentPart.current = new Tone.Part((time, value) => {
       if (synth.current) { // Ensure synth exists before playing
           synth.current.triggerAttackRelease(value.note, value.duration, time);
           // Visual Flash Effect
           const visualStartTime = time;
           Tone.Draw.schedule(() => setActiveNotes(prev => new Set(prev).add(value.note)), visualStartTime);
           const visualEndTime = visualStartTime + 0.12;
           Tone.Draw.schedule(() => setActiveNotes(prev => {
               const newNotes = new Set(prev); newNotes.delete(value.note); return newNotes;
           }), visualEndTime);
       }
     }, tuneData).start(0);

     // Schedule cleanup
     const lastNote = tuneData[tuneData.length - 1];
     const endTime = Tone.Time(lastNote.time).toSeconds() + Tone.Time(lastNote.duration).toSeconds();
     Tone.Transport.scheduleOnce(() => {
       console.log("Tune finished playback.");
       setIsPlayingTune(false);
       setActiveNotes(new Set());
       currentPart.current = null;
     }, endTime + 0.2);

     Tone.Transport.start(Tone.now());

  }, [isAudioReady, isPlayingTune, stopTune, initializeAudio, noteRelease]); // Dependencies


  // Effect to stop tune if the component unmounts
  useEffect(() => {
    return () => stopTune();
  }, [stopTune]);


  // === Component Render ===
  return (
    // Removed the onClick handler for audio init from this div
    <div className="app-container">

      {/* Overlay is removed */}

      <Header currentTheme={theme} onToggleTheme={toggleTheme} />

      <main className="main-content">
        <Keyboard
          activeKeys={activeNotes}
          onAttack={noteAttack}
          onRelease={noteRelease}
        />

        <p className="keyboard-instructions">
          Use keyboard keys (A, W, S, E, D, F, T, G, Y, H, U, J, K, O, L, P, ;) to play!
        </p>

        <div className="tune-controls">
          {tunes.map(tune => (
            <TuneButton
              key={tune.name}
              tuneName={tune.name}
              onPlayTune={() => playTune(tune.data)}
              isPlaying={isPlayingTune}
            />
          ))}
          {isPlayingTune && (
            <button onClick={stopTune} className="stop-button">
              Stop Tune
            </button>
          )}
        </div>
      </main>

      <Footer />

    </div>
  );
}

export default App;

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos