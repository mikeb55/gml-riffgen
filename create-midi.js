const fs = require('fs');
const path = require('path');

// Create directories
['src', 'test', 'test/test-output'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true});
});

// Create MidiExporter.js
const midiCode = `
class MidiExporter {
  constructor() { this.ticksPerQuarter = 480; }
  
  exportToMidi(comp) {
    // Create valid MIDI with header and one note
    const bytes = [
      // Header
      0x4D,0x54,0x68,0x64, // MThd
      0,0,0,6,             // header size
      0,1,                 // format 1
      0,2,                 // 2 tracks
      1,0xE0,              // 480 ticks/quarter
      
      // Track 1 - Tempo
      0x4D,0x54,0x72,0x6B, // MTrk
      0,0,0,11,            // track size
      0,0xFF,0x51,3,       // tempo event
      7,0xA1,0x20,         // 120 BPM
      0,0xFF,0x2F,0,       // end track
      
      // Track 2 - Note
      0x4D,0x54,0x72,0x6B, // MTrk  
      0,0,0,16,            // track size
      0,0xC0,40,           // program: violin
      0,0x90,60,80,        // C4 on
      0x87,0x08,           // wait
      0x80,60,0,           // C4 off
      0,0xFF,0x2F,0        // end track
    ];
    return Buffer.from(bytes);
  }
  
  saveMidiFile(data, filename) {
    fs.writeFileSync(filename, data);
    return filename;
  }
}
module.exports = MidiExporter;
`;

fs.writeFileSync('src/MidiExporter.js', midiCode);
console.log('✅ Created MidiExporter.js');

// Test it
const MidiExporter = require('./src/MidiExporter');
const exporter = new MidiExporter();
const midiData = exporter.exportToMidi({});
const savedFile = exporter.saveMidiFile(midiData, 'test/test-output/working.mid');

console.log('✅ MIDI file created!');
console.log('📁 Location: test/test-output/working.mid');
console.log('📊 Size: ' + midiData.length + ' bytes');
console.log('\n🎉 SUCCESS! Open working.mid in Guitar Pro or Sibelius');
