const MidiExporter = require('./src/MidiExporter');
const exp = new MidiExporter();
const data = exp.exportToMidi({});
exp.saveMidiFile(data, 'test/test-output/working.mid');
console.log('SUCCESS! Check test/test-output/working.mid');
