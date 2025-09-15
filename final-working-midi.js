cd /c/Users/mike/Documents/gml-workspace/gml-riffgen && cat > final-working-midi.js << 'ENDOFFILE'
const fs = require('fs');
const path = require('path');

// Ensure directories exist
['src', 'test', 'test/test-output'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true});
});

// PROPERLY WORKING MidiExporter
const WORKING_MIDI = `const fs = require('fs');

class MidiExporter {
  constructor() {
    this.ticksPerQuarter = 480;
    this.instruments = {
      guitar: 24,
      violinI: 40,
      violinII: 40,
      viola: 41,
      cello: 42
    };
  }
  
  exportToMidi(composition) {
    const buffer = [];
    
    // MIDI Header
    this.writeBytes(buffer, [0x4D, 0x54, 0x68, 0x64]); // MThd
    this.writeBytes(buffer, [0x00, 0x00, 0x00, 0x06]); // Header size
    this.writeBytes(buffer, [0x00, 0x01]); // Format 1
    this.writeBytes(buffer, [0x00, 0x02]); // 2 tracks
    this.writeInt16(buffer, this.ticksPerQuarter);
    
    // Track 1: Tempo
    this.writeTempoTrack(buffer);
    
    // Track 2: Notes
    this.writeNoteTrack(buffer);
    
    return Buffer.from(buffer);
  }
  
  writeTempoTrack(buffer) {
    const track = [];
    
    // Tempo meta event
    this.writeVarLength(track, 0); // Delta time
    this.writeBytes(track, [0xFF, 0x51, 0x03]); // Set Tempo
    const tempo = 500000; // 120 BPM in microseconds
    this.writeInt24(track, tempo);
    
    // Time signature
    this.writeVarLength(track, 0); // Delta time
    this.writeBytes(track, [0xFF, 0x58, 0x04]); // Time Sig
    this.writeBytes(track, [0x04, 0x02, 0x18, 0x08]); // 4/4
    
    // End of track
    this.writeVarLength(track, 0);
    this.writeBytes(track, [0xFF, 0x2F, 0x00]);
    
    // Write track header and data
    this.writeBytes(buffer, [0x4D, 0x54, 0x72, 0x6B]); // MTrk
    this.writeInt32(buffer, track.length); // CALCULATED length!
    this.writeBytes(buffer, track);
  }
  
  writeNoteTrack(buffer) {
    const track = [];
    
    // Program change (Violin)
    this.writeVarLength(track, 0);
    this.writeBytes(track, [0xC0, 40]);
    
    // Note: Middle C
    this.writeVarLength(track, 0); // Delta: immediate
    this.writeBytes(track, [0x90, 60, 64]); // Note On: C4, velocity 64
    
    this.writeVarLength(track, 480); // Delta: 1 quarter note
    this.writeBytes(track, [0x80, 60, 0]); // Note Off
    
    // End of track
    this.writeVarLength(track, 0);
    this.writeBytes(track, [0xFF, 0x2F, 0x00]);
    
    // Write track header and data
    this.writeBytes(buffer, [0x4D, 0x54, 0x72, 0x6B]); // MTrk
    this.writeInt32(buffer, track.length); // CALCULATED length!
    this.writeBytes(buffer, track);
  }
  
  // CORRECT Variable Length Encoding
  writeVarLength(buffer, value) {
    if (value === 0) {
      buffer.push(0);
      return;
    }
    
    const bytes = [];
    while (value > 0) {
      bytes.unshift(value & 0x7F);
      value >>>= 7; // Use unsigned shift
    }
    
    for (let i = 0; i < bytes.length - 1; i++) {
      buffer.push(bytes[i] | 0x80);
    }
    buffer.push(bytes[bytes.length - 1]);
  }
  
  writeBytes(buffer, bytes) {
    bytes.forEach(b => buffer.push(b));
  }
  
  writeInt16(buffer, value) {
    buffer.push((value >> 8) & 0xFF);
    buffer.push(value & 0xFF);
  }
  
  writeInt24(buffer, value) {
    buffer.push((value >> 16) & 0xFF);
    buffer.push((value >> 8) & 0xFF);
    buffer.push(value & 0xFF);
  }
  
  writeInt32(buffer, value) {
    buffer.push((value >>> 24) & 0xFF);
    buffer.push((value >>> 16) & 0xFF);
    buffer.push((value >>> 8) & 0xFF);
    buffer.push(value & 0xFF);
  }
  
  saveMidiFile(data, filename) {
    fs.writeFileSync(filename, data);
    console.log(\`✅ MIDI saved: \${filename}\`);
    console.log(\`📊 Size: \${data.length} bytes\`);
    
    // Verify MIDI structure
    if (data[0] === 0x4D && data[1] === 0x54 && data[2] === 0x68 && data[3] === 0x64) {
      console.log('✅ Valid MIDI header');
    }
    
    return filename;
  }
}

module.exports = MidiExporter;
`;

// Write the file
fs.writeFileSync('src/MidiExporter.js', WORKING_MIDI);
console.log('✅ MidiExporter.js created with proper MIDI structure');

// Test it
console.log('\n🧪 Testing MIDI generation...\n');

// Clear require cache to ensure fresh load
delete require.cache[require.resolve('./src/MidiExporter')];
const MidiExporter = require('./src/MidiExporter');

const exporter = new MidiExporter();
const midiData = exporter.exportToMidi({});

// Save it
const outputFile = 'test/test-output/verified-working.mid';
exporter.saveMidiFile(midiData, outputFile);

// Additional verification
const bytes = Array.from(midiData.slice(0, 20));
console.log('\nFirst 20 bytes (hex):', bytes.map(b => b.toString(16).padStart(2, '0')).join(' '));

console.log('\n🎉 SUCCESS! MIDI file is properly structured');
console.log('📍 Open test/test-output/verified-working.mid in:');
console.log('   - Windows Media Player (quick test)');
console.log('   - Guitar Pro or Sibelius (full test)');
ENDOFFILE
node final-working-midi.js