/**
 * GML-Quartet Complete Test - All in One File
 * No dependencies needed except fs (built-in)
 * Just save and run: node quartet-complete.js
 */

const fs = require('fs');

// Simple XML builder (no external dependencies)
class SimpleXMLBuilder {
    static createDocument() {
        return {
            elements: [],
            addElement(name, attrs = {}, content = '') {
                const element = { name, attrs, content, children: [] };
                this.elements.push(element);
                return element;
            },
            toString() {
                let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
                xml += '<score-partwise version="3.1">\n';
                this.elements.forEach(el => {
                    xml += SimpleXMLBuilder.elementToString(el, 1);
                });
                xml += '</score-partwise>';
                return xml;
            }
        };
    }
    
    static elementToString(element, indent = 0) {
        const spaces = '  '.repeat(indent);
        let xml = `${spaces}<${element.name}`;
        
        for (const [key, value] of Object.entries(element.attrs)) {
            xml += ` ${key}="${value}"`;
        }
        
        if (element.content || element.children.length > 0) {
            xml += '>';
            if (element.content) {
                xml += element.content;
            }
            if (element.children.length > 0) {
                xml += '\n';
                element.children.forEach(child => {
                    xml += SimpleXMLBuilder.elementToString(child, indent + 1);
                });
                xml += spaces;
            }
            xml += `</${element.name}>\n`;
        } else {
            xml += '/>\n';
        }
        
        return xml;
    }
    
    static createElement(name, attrs = {}, content = '') {
        return { name, attrs, content, children: [] };
    }
    
    static addChild(parent, child) {
        parent.children.push(child);
        return child;
    }
}

// The complete GML-Quartet Engine
class GMLQuartetEngine {
    constructor(config = {}) {
        this.key = config.key || 'C';
        this.mode = config.mode || 'major';
        this.style = config.style || 'romantic';
        this.tempo = config.tempo || 120;
        this.measures = config.measures || 16;
        this.timeSignature = { numerator: 4, denominator: 4 };
        this.divisions = 256;
        this.measureDivisions = this.divisions * this.timeSignature.numerator; // 1024
    }

    generateScore() {
        return {
            title: `GML-Quartet ${this.style.charAt(0).toUpperCase() + this.style.slice(1)} in ${this.key}`,
            composer: 'GML-Quartet Engine V1.0.0',
            parts: {
                violinI: this.generateViolinI(),
                violinII: this.generateViolinII(),
                viola: this.generateViola(),
                cello: this.generateCello()
            }
        };
    }

    generateViolinI() {
        const measures = [];
        const scale = this.getScale(this.key, this.mode);
        
        for (let m = 0; m < this.measures; m++) {
            const measure = [];
            let remainingDivisions = this.measureDivisions;
            
            const patterns = [
                [256, 256, 256, 256],
                [512, 256, 256],
                [256, 256, 512],
                [384, 128, 256, 256]
            ];
            
            const pattern = patterns[m % patterns.length];
            const noteIndex = m % scale.length;
            
            pattern.forEach((duration, i) => {
                if (remainingDivisions >= duration) {
                    measure.push({
                        pitch: scale[(noteIndex + i * 2) % scale.length],
                        octave: 4 + Math.floor((noteIndex + i * 2) / scale.length) % 2,
                        duration: duration,
                        type: this.durationType(duration)
                    });
                    remainingDivisions -= duration;
                }
            });
            
            if (remainingDivisions > 0) {
                measure.push({
                    rest: true,
                    duration: remainingDivisions,
                    type: this.durationType(remainingDivisions)
                });
            }
            
            measures.push(measure);
        }
        
        return measures;
    }

    generateViolinII() {
        const measures = [];
        const scale = this.getScale(this.key, this.mode);
        
        for (let m = 0; m < this.measures; m++) {
            const measure = [];
            let remainingDivisions = this.measureDivisions;
            
            const patterns = [
                [256, 256, 256, 256],
                [256, 256, 512],
                [128, 128, 256, 512]
            ];
            
            const pattern = patterns[m % patterns.length];
            const noteIndex = (m + 2) % scale.length;
            
            pattern.forEach((duration, i) => {
                if (remainingDivisions >= duration) {
                    measure.push({
                        pitch: scale[(noteIndex + i) % scale.length],
                        octave: 3 + Math.floor((noteIndex + i) / scale.length) % 2,
                        duration: duration,
                        type: this.durationType(duration)
                    });
                    remainingDivisions -= duration;
                }
            });
            
            if (remainingDivisions > 0) {
                measure.push({
                    rest: true,
                    duration: remainingDivisions,
                    type: this.durationType(remainingDivisions)
                });
            }
            
            measures.push(measure);
        }
        
        return measures;
    }

    generateViola() {
        const measures = [];
        const scale = this.getScale(this.key, this.mode);
        
        for (let m = 0; m < this.measures; m++) {
            const measure = [];
            let remainingDivisions = this.measureDivisions;
            
            // FIXED: Patterns that equal exactly 1024
            const patterns = [
                [256, 256, 256, 256],    // 4 quarters = 1024
                [512, 512],               // 2 halves = 1024
                [256, 256, 512],          // 2 quarters + half = 1024
                [512, 256, 256]           // half + 2 quarters = 1024
            ];
            
            const pattern = patterns[m % patterns.length];
            
            pattern.forEach((duration, i) => {
                if (remainingDivisions >= duration) {
                    const noteIndex = (m * 2 + i) % scale.length;
                    measure.push({
                        pitch: scale[noteIndex],
                        octave: 3,
                        duration: duration,
                        type: this.durationType(duration)
                    });
                    remainingDivisions -= duration;
                }
            });
            
            // Should not happen with correct patterns
            if (remainingDivisions > 0) {
                console.log(`Warning: Viola measure ${m + 1} has ${remainingDivisions} remaining`);
                measure.push({
                    rest: true,
                    duration: remainingDivisions,
                    type: this.durationType(remainingDivisions)
                });
            }
            
            measures.push(measure);
        }
        
        return measures;
    }

    generateCello() {
        const measures = [];
        const scale = this.getScale(this.key, this.mode);
        
        for (let m = 0; m < this.measures; m++) {
            const measure = [];
            let remainingDivisions = this.measureDivisions;
            
            // FIXED: Patterns that equal exactly 1024
            const patterns = [
                [256, 256, 256, 256],     // Walking bass = 1024
                [512, 256, 256],           // Half + 2 quarters = 1024
                [1024],                    // Whole note = 1024
                [512, 512]                 // 2 halves = 1024
            ];
            
            const pattern = patterns[m % patterns.length];
            
            pattern.forEach((duration, i) => {
                if (remainingDivisions >= duration) {
                    const bassNotes = [0, 4, 2, 4]; // Root, fifth, third pattern
                    const noteIndex = bassNotes[i % bassNotes.length];
                    measure.push({
                        pitch: scale[noteIndex % scale.length],
                        octave: 2,
                        duration: duration,
                        type: this.durationType(duration)
                    });
                    remainingDivisions -= duration;
                }
            });
            
            // Should not happen with correct patterns
            if (remainingDivisions > 0) {
                console.log(`Warning: Cello measure ${m + 1} has ${remainingDivisions} remaining`);
                measure.push({
                    rest: true,
                    duration: remainingDivisions,
                    type: this.durationType(remainingDivisions)
                });
            }
            
            measures.push(measure);
        }
        
        return measures;
    }

    getScale(key, mode) {
        const scales = {
            'C major': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
            'C minor': ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'],
            'G major': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
            'D major': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#']
        };
        
        return scales[`${key} ${mode}`] || scales['C major'];
    }

    durationType(duration) {
        const types = {
            1024: 'whole',
            512: 'half',
            384: 'quarter',
            256: 'quarter',
            128: 'eighth',
            64: '16th'
        };
        
        return types[duration] || 'quarter';
    }

    validateScore(score) {
        const issues = [];
        let allValid = true;
        
        console.log('\nValidating measures:');
        console.log('-'.repeat(50));
        
        ['violinI', 'violinII', 'viola', 'cello'].forEach(part => {
            let partValid = true;
            score.parts[part].forEach((measure, index) => {
                let totalDuration = 0;
                measure.forEach(note => {
                    totalDuration += note.duration;
                });
                
                if (totalDuration !== this.measureDivisions) {
                    issues.push(`${part} measure ${index + 1}: ${totalDuration}/${this.measureDivisions}`);
                    partValid = false;
                    allValid = false;
                }
            });
            console.log(`${part.padEnd(10)} : ${partValid ? '✅ All measures complete' : '❌ Has incomplete measures'}`);
        });
        
        console.log('-'.repeat(50));
        
        if (!allValid) {
            console.log('\n❌ Issues found:');
            issues.forEach(issue => console.log(`  - ${issue}`));
        }
        
        return allValid;
    }

    toMusicXML() {
        const score = this.generateScore();
        const doc = SimpleXMLBuilder.createDocument();
        
        // Add work
        const work = SimpleXMLBuilder.createElement('work');
        SimpleXMLBuilder.addChild(work, SimpleXMLBuilder.createElement('work-title', {}, score.title));
        doc.elements.push(work);
        
        // Add identification
        const identification = SimpleXMLBuilder.createElement('identification');
        const creator = SimpleXMLBuilder.createElement('creator', { type: 'composer' }, score.composer);
        SimpleXMLBuilder.addChild(identification, creator);
        doc.elements.push(identification);
        
        // Add part-list
        const partList = SimpleXMLBuilder.createElement('part-list');
        const parts = [
            { id: 'P1', name: 'Violin I' },
            { id: 'P2', name: 'Violin II' },
            { id: 'P3', name: 'Viola' },
            { id: 'P4', name: 'Cello' }
        ];
        
        parts.forEach(p => {
            const scorePart = SimpleXMLBuilder.createElement('score-part', { id: p.id });
            SimpleXMLBuilder.addChild(scorePart, SimpleXMLBuilder.createElement('part-name', {}, p.name));
            SimpleXMLBuilder.addChild(partList, scorePart);
        });
        doc.elements.push(partList);
        
        // Add parts
        const partData = [
            { id: 'P1', measures: score.parts.violinI, clef: 'G', line: 2 },
            { id: 'P2', measures: score.parts.violinII, clef: 'G', line: 2 },
            { id: 'P3', measures: score.parts.viola, clef: 'C', line: 3 },
            { id: 'P4', measures: score.parts.cello, clef: 'F', line: 4 }
        ];
        
        partData.forEach(p => {
            const part = SimpleXMLBuilder.createElement('part', { id: p.id });
            
            p.measures.forEach((measureNotes, index) => {
                const measure = SimpleXMLBuilder.createElement('measure', { number: String(index + 1) });
                
                // Add attributes for first measure
                if (index === 0) {
                    const attributes = SimpleXMLBuilder.createElement('attributes');
                    SimpleXMLBuilder.addChild(attributes, SimpleXMLBuilder.createElement('divisions', {}, String(this.divisions)));
                    
                    const key = SimpleXMLBuilder.createElement('key');
                    SimpleXMLBuilder.addChild(key, SimpleXMLBuilder.createElement('fifths', {}, '0'));
                    SimpleXMLBuilder.addChild(attributes, key);
                    
                    const time = SimpleXMLBuilder.createElement('time');
                    SimpleXMLBuilder.addChild(time, SimpleXMLBuilder.createElement('beats', {}, String(this.timeSignature.numerator)));
                    SimpleXMLBuilder.addChild(time, SimpleXMLBuilder.createElement('beat-type', {}, String(this.timeSignature.denominator)));
                    SimpleXMLBuilder.addChild(attributes, time);
                    
                    const clef = SimpleXMLBuilder.createElement('clef');
                    SimpleXMLBuilder.addChild(clef, SimpleXMLBuilder.createElement('sign', {}, p.clef));
                    SimpleXMLBuilder.addChild(clef, SimpleXMLBuilder.createElement('line', {}, String(p.line)));
                    SimpleXMLBuilder.addChild(attributes, clef);
                    
                    SimpleXMLBuilder.addChild(measure, attributes);
                }
                
                // Add notes
                measureNotes.forEach(noteData => {
                    const note = SimpleXMLBuilder.createElement('note');
                    
                    if (noteData.rest) {
                        SimpleXMLBuilder.addChild(note, SimpleXMLBuilder.createElement('rest'));
                    } else {
                        const pitch = SimpleXMLBuilder.createElement('pitch');
                        SimpleXMLBuilder.addChild(pitch, SimpleXMLBuilder.createElement('step', {}, noteData.pitch.charAt(0)));
                        
                        if (noteData.pitch.includes('#')) {
                            SimpleXMLBuilder.addChild(pitch, SimpleXMLBuilder.createElement('alter', {}, '1'));
                        } else if (noteData.pitch.includes('b')) {
                            SimpleXMLBuilder.addChild(pitch, SimpleXMLBuilder.createElement('alter', {}, '-1'));
                        }
                        
                        SimpleXMLBuilder.addChild(pitch, SimpleXMLBuilder.createElement('octave', {}, String(noteData.octave)));
                        SimpleXMLBuilder.addChild(note, pitch);
                    }
                    
                    SimpleXMLBuilder.addChild(note, SimpleXMLBuilder.createElement('duration', {}, String(noteData.duration)));
                    SimpleXMLBuilder.addChild(note, SimpleXMLBuilder.createElement('type', {}, noteData.type));
                    
                    SimpleXMLBuilder.addChild(measure, note);
                });
                
                SimpleXMLBuilder.addChild(part, measure);
            });
            
            doc.elements.push(part);
        });
        
        return doc.toString();
    }
}

// MAIN TEST EXECUTION
console.log('================================================');
console.log('   GML-QUARTET ENGINE TEST V1.0.0');
console.log('================================================\n');

console.log('Current directory:', process.cwd());
console.log('Starting test...\n');

// Create the quartet
const quartet = new GMLQuartetEngine({
    key: 'C',
    mode: 'major',
    style: 'romantic',
    tempo: 120,
    measures: 4  // Short test
});

console.log('Generating score...');
const score = quartet.generateScore();
console.log(`✅ Score generated: "${score.title}"`);

// Validate
const isValid = quartet.validateScore(score);

if (isValid) {
    console.log('\n✅ SUCCESS: All measures are complete!');
    
    // Generate MusicXML
    console.log('\nGenerating MusicXML...');
    const xml = quartet.toMusicXML();
    
    // Save to file
    const filename = 'quartet-output.musicxml';
    fs.writeFileSync(filename, xml, 'utf8');
    console.log(`✅ Saved to: ${filename}`);
    console.log(`   File size: ${xml.length} bytes`);
    
    // Show summary
    console.log('\n================================================');
    console.log('DETAILED MEASURE BREAKDOWN:');
    console.log('================================================');
    
    ['violinI', 'violinII', 'viola', 'cello'].forEach(part => {
        console.log(`\n${part.toUpperCase()}:`);
        score.parts[part].forEach((measure, i) => {
            const noteCount = measure.filter(n => !n.rest).length;
            const restCount = measure.filter(n => n.rest).length;
            const total = measure.reduce((sum, note) => sum + note.duration, 0);
            console.log(`  Measure ${i + 1}: ${total}/1024 divisions | ${noteCount} notes, ${restCount} rests`);
        });
    });
    
    console.log('\n================================================');
    console.log('✅ TEST COMPLETE - Open quartet-output.musicxml');
    console.log('   in MuseScore or Sibelius to verify');
    console.log('================================================');
} else {
    console.log('\n❌ FAILURE: Some measures are incomplete');
    console.log('   Check the validation output above for details');
}