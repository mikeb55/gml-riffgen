const FretPositionOptimizer = require('./FretPositionOptimizer');
const optimizer = new FretPositionOptimizer();

// Your problematic sequence from the MusicXML
console.log('Testing impossible fret jumps from your file:');
console.log('Original: fret 9→1→4→16→4 (impossible!)');

const testNotes = [61, 56, 49, 68, 54]; // The actual notes
const optimized = optimizer.optimizeRiff(testNotes);

console.log('\nOptimized positions:');
optimized.forEach((pos, i) => {
    console.log(`Note ${i+1}: String ${pos.string+1}, Fret ${pos.fret}`);
});
