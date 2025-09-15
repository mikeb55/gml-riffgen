const GMLQuartetEngine = require('./gml-quartet-engine');
const fs = require('fs');

console.log('Testing GML-Quartet...\n');

const quartet = new GMLQuartetEngine({
    key: 'C',
    mode: 'major',
    style: 'romantic',
    tempo: 120,
    measures: 4
});

const score = quartet.generateScore();
const isValid = quartet.validateScore(score);

if (isValid) {
    console.log('✅ All measures complete!');
    const xml = quartet.toMusicXML();
    fs.writeFileSync('quartet-output.musicxml', xml);
    console.log('✅ Saved to quartet-output.musicxml');
} else {
    console.log('❌ Failed validation');
}