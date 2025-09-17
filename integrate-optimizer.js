/**
 * BULLETPROOF Integration: Connect FretPositionOptimizer to RiffGen
 * This modifies your MusicXML export to use optimized fret positions
 */

const FretPositionOptimizer = require('./FretPositionOptimizer');

// Initialize optimizer
const optimizer = new FretPositionOptimizer();

// Function to convert your riff notes to optimized TAB
function convertToPlayableTAB(notes) {
    // Convert your note format to MIDI numbers
    const midiNotes = notes.map(note => {
        // Assuming notes have a pitch property
        return noteToMidi(note.pitch, note.octave);
    });
    
    // Get optimized positions
    const positions = optimizer.optimizeRiff(midiNotes);
    
    // Merge positions back with original notes
    return notes.map((note, i) => ({
        ...note,
        string: positions[i].string + 1, // Convert 0-based to 1-based
        fret: positions[i].fret
    }));
}

// Helper: Convert note name to MIDI number
function noteToMidi(pitch, octave) {
    const noteMap = {
        'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
        'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
    };
    return (octave + 1) * 12 + noteMap[pitch];
}

console.log('Integration ready. Use convertToPlayableTAB() before MusicXML export.');
module.exports = { convertToPlayableTAB, noteToMidi };
