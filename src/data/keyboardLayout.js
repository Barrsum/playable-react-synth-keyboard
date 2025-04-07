// src/data/keyboardLayout.js

// Notes C4 to E5 to match HTML example
export const notes = [
    // Octave 4
    { note: 'C4', key: 'a', isBlack: false, sargam: 'सा' },
    { note: 'Db4', key: 'w', isBlack: true }, // C#4
    { note: 'D4', key: 's', isBlack: false, sargam: 'रे' },
    { note: 'Eb4', key: 'e', isBlack: true }, // D#4
    { note: 'E4', key: 'd', isBlack: false, sargam: 'ग' },
    { note: 'F4', key: 'f', isBlack: false, sargam: 'म' },
    { note: 'Gb4', key: 't', isBlack: true }, // F#4
    { note: 'G4', key: 'g', isBlack: false, sargam: 'प' },
    { note: 'Ab4', key: 'y', isBlack: true }, // G#4
    { note: 'A4', key: 'h', isBlack: false, sargam: 'ध' },
    { note: 'Bb4', key: 'u', isBlack: true }, // A#4
    { note: 'B4', key: 'j', isBlack: false, sargam: 'नि' },
    // Octave 5
    { note: 'C5', key: 'k', isBlack: false, sargam: 'सां' }, // Use सां for upper Sa
    { note: 'Db5', key: 'o', isBlack: true }, // C#5
    { note: 'D5', key: 'l', isBlack: false, sargam: 'रें' }, // Upper Re
    { note: 'Eb5', key: 'p', isBlack: true }, // D#5
    { note: 'E5', key: ';', isBlack: false, sargam: 'गं' }, // Upper Ga
  ];
  
  // Create a mapping for quick lookup from computer key to note
  export const keyToNoteMap = notes.reduce((map, currentNote) => {
    if (currentNote.key) { // Ensure key exists before mapping
        map[currentNote.key.toLowerCase()] = currentNote.note;
    }
    return map;
  }, {});
  
  // Create a mapping from note name back to key data (useful for tune playback)
  export const noteToDataMap = notes.reduce((map, currentNote) => {
      map[currentNote.note] = currentNote;
      return map;
  }, {});

  // Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos