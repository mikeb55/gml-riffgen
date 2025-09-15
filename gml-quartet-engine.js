// Make sure xmldom is installed first
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');

// Paste the entire GMLQuartetEngine class here since it's not in a separate file
class GMLQuartetEngine {
    // ... (copy the entire class from the artifact above)
}

// Test code
console.log('Testing GML-Quartet Engine V1.0.0\n');
console.log('=' .repeat(40));

const quartet = new GMLQuartetEngine({
    key: 'C',
    mode: 'major', 
    style: 'romantic',
    tempo: 120,
    measures: 4
});

console.log('\nGenerating score...');
const score = quartet.generateScore();

console.log('Validating all measures...');
const isValid = quartet.validateScore(score);

if (isValid) {
    console.log('✅ All measures complete!');
    const fs = require('fs');
    const xml = quartet.toMusicXML();
    fs.writeFileSync('quartet-test.musicxml', xml, 'utf8');
    console.log('✅ Saved to: quartet-test.musicxml');
}