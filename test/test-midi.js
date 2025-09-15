const MidiExporter = require('../src/MidiExporter');
const exporter = new MidiExporter();
const data = exporter.exportToMidi({tempo: 120});
exporter.saveMidiFile(data, 'test/test-output/test.mid');
console.log('SUCCESS! MIDI Export V1.2.0 installed!');
