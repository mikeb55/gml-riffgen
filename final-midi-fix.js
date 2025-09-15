const fs = require('fs');
const path = require('path');

// Ensure directories
['src', 'test', 'test/test-output'].forEach(dir => {
  if (!fs.existsSync(path.join(__dirname, dir))) {
    fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
  }
});

// Write MidiExporter
const code = `// MidiExporter.js
class MidiExporter {
  constructor() { this.ticksPerQuarter = 480; }
  exportToMidi(comp) {
    const b = [];
    // MIDI header
    b.push(0x4D,0x54,0x68,0x64,0,0,0,6,0,1,0,2);
    b.push((480>>8)&0xFF,480&0xFF);
    // Tempo track
    b.push(0x4D,0x54,0x72,0x6B,0,0,0,14);
    b.push(0,0xFF,0x51,3,7,161,32); // 120bpm
    b.push(0,0xFF,0x58,4,4,2,24,8); // 4/4
    b.push(0,0xFF,0x2F,0);
    // Note track
    b.push(0x4D,0x54,0x72,0x6B,0,0,0,19);
    b.push(0,0xC0,40); // Violin
    b.push(0,0x90,60,80); // C note on
    b.push(0x83,0x60,0x80,60,0); // Note off after 480 ticks
    b.push(0,0xFF,0x2F,0);
    return Buffer.from(b);
  }
  saveMidiFile(data, filename) {
    fs.writeFileSync(filename, data);
    console.log('Saved: ' + filename);
  }
}
module.exports = MidiExporter;
`;

fs.writeFileSync('src/MidiExporter.js', code);
console.log('MidiExporter.js created');

// Test it
const MidiExporter = require('./src/MidiExporter');
const exp = new MidiExporter();
const midi = exp.exportToMidi({});
exp.saveMidiFile(midi, 'test/test-output/final.mid');
console.log('SUCCESS! File size: ' + midi.length + ' bytes');
console.log('Open test/test-output/final.mid in your DAW');
