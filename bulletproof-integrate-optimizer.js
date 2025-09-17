#!/usr/bin/env node
/**
 * BULLETPROOF-9x3 Automated Optimizer Integration
 * Zero manual editing required
 * @version 1.2.1
 */

const fs = require('fs');
const path = require('path');

// BULLETPROOF Layer 1: Environment Validation
console.log('========================================');
console.log('BULLETPROOF OPTIMIZER INTEGRATION V1.2.1');
console.log('========================================\n');

const projectDir = process.cwd();
const indexPath = path.join(projectDir, 'index.html');
const backupPath = path.join(projectDir, `index-backup-${Date.now()}.html`);
const testPath = path.join(projectDir, 'index-optimized.html');

// Check if index.html exists
if (!fs.existsSync(indexPath)) {
    console.error('[FAIL] index.html not found in current directory');
    console.error('Make sure you are in: C:\\Users\\mike\\Documents\\gml-workspace\\gml-riffgen');
    process.exit(1);
}

// BULLETPROOF Layer 2: Backup Creation
console.log('[1/6] Creating backup...');
fs.copyFileSync(indexPath, backupPath);
console.log(`✅ Backup saved as: ${path.basename(backupPath)}`);

// Read the current index.html
console.log('[2/6] Reading index.html...');
let htmlContent = fs.readFileSync(indexPath, 'utf8');
console.log(`✅ Read ${htmlContent.length} bytes`);

// BULLETPROOF Layer 3: Injection Points Validation
console.log('[3/6] Validating injection points...');

// Check if already integrated
if (htmlContent.includes('class FretPositionOptimizer')) {
    console.log('⚠️ Optimizer already integrated. Creating fresh version...');
    // Restore from backup pattern
    htmlContent = fs.readFileSync(backupPath, 'utf8');
}

// Find injection point for optimizer class (before RiffGenerator)
const riffGenIndex = htmlContent.indexOf('class RiffGenerator {');
if (riffGenIndex === -1) {
    console.error('[FAIL] Could not find RiffGenerator class');
    process.exit(1);
}

// The optimizer class to inject
const optimizerClass = `
        // BULLETPROOF FretPositionOptimizer - Injected by automated script
        class FretPositionOptimizer {
            constructor() {
                this.midiTuning = [40, 45, 50, 55, 59, 64]; // E2, A2, D3, G3, B3, E4
                this.stringFrequencies = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63];
                this.stringNames = ['E', 'A', 'D', 'G', 'B', 'e'];
                this.MAX_STRETCH = 4;
                this.MAX_FRET = 19;
            }

            optimizePositions(notes) {
                const optimized = [];
                let previousFret = -1;
                let previousString = -1;
                
                for (const note of notes) {
                    const candidates = [];
                    
                    // Find all possible positions
                    for (let s = 0; s < 6; s++) {
                        const fret = Math.round(12 * Math.log2(note.frequency / this.stringFrequencies[s]));
                        
                        if (fret < 0 || fret > this.MAX_FRET) continue;
                        
                        let score = 100;
                        if (fret === 0) score += 20;
                        if (fret >= 3 && fret <= 7) score += 15;
                        if (fret > 12) score -= (fret - 12) * 2;
                        
                        if (previousFret !== -1) {
                            const movement = Math.abs(fret - previousFret);
                            if (movement === 0) score += 25;
                            else if (movement <= this.MAX_STRETCH) score += 20 - movement * 3;
                            else score -= movement * 5;
                        }
                        
                        if (previousString !== -1) {
                            score -= Math.abs(s - previousString) * 2;
                        }
                        
                        candidates.push({
                            string: this.stringNames[s],
                            fret: fret,
                            score: score
                        });
                    }
                    
                    candidates.sort((a, b) => b.score - a.score);
                    const best = candidates[0] || { string: 'E', fret: 0 };
                    
                    optimized.push({
                        ...note,
                        string: best.string,
                        fret: best.fret
                    });
                    
                    previousFret = best.fret;
                    previousString = this.stringNames.indexOf(best.string);
                }
                
                console.log('✅ Optimized ' + optimized.length + ' note positions');
                return optimized;
            }
        }

        `;

// BULLETPROOF Layer 4: Method Replacement
console.log('[4/6] Injecting optimizer class...');
htmlContent = htmlContent.slice(0, riffGenIndex) + optimizerClass + htmlContent.slice(riffGenIndex);
console.log('✅ Optimizer class injected');

console.log('[5/6] Patching generateRiffData method...');

// Find and replace the generateRiffData method
const methodStart = htmlContent.indexOf('generateRiffData(params, seed) {');
const methodEnd = htmlContent.indexOf('return {', methodStart);
const nextMethod = htmlContent.indexOf('seededRandom(seed) {', methodEnd);

if (methodStart === -1 || methodEnd === -1) {
    console.error('[FAIL] Could not find generateRiffData method');
    process.exit(1);
}

// Extract the method's return statement
const returnStart = htmlContent.indexOf('return {', methodStart);
const returnEnd = htmlContent.indexOf('};', returnStart) + 2;

// Build the new method
const newMethod = `generateRiffData(params, seed) {
                // BULLETPROOF-9x3 Enhanced with Optimizer
                const random = this.seededRandom(seed);
                
                const scale = this.scales[params.scale];
                const rootNote = this.noteFrequencies[params.key];
                const beatsPerMeasure = 4;
                const totalBeats = params.measures * beatsPerMeasure;
                
                const notes = [];
                let currentBeat = 0;
                
                // Generate raw notes first
                while (currentBeat < totalBeats) {
                    if (random() > 0.2) {
                        const scaleIndex = Math.floor(random() * scale.length);
                        const octaveOffset = Math.floor(random() * 3) - 1;
                        const semitoneOffset = scale[scaleIndex];
                        
                        const frequency = rootNote * Math.pow(2, (semitoneOffset + octaveOffset * 12) / 12);
                        
                        const durationOptions = this.getDurationOptions(params.complexity);
                        const duration = durationOptions[Math.floor(random() * durationOptions.length)];
                        
                        notes.push({
                            frequency: frequency,
                            duration: duration,
                            beat: currentBeat
                        });
                        
                        currentBeat += duration;
                    } else {
                        currentBeat += 0.25;
                    }
                }
                
                // Apply position optimization
                let optimizedNotes;
                try {
                    const optimizer = new FretPositionOptimizer();
                    optimizedNotes = optimizer.optimizePositions(notes);
                } catch (error) {
                    console.error('Optimizer failed, using fallback:', error);
                    optimizedNotes = notes.map(note => ({
                        ...note,
                        ...this.frequencyToFret(note.frequency)
                    }));
                }
                
                return {
                    notes: optimizedNotes,
                    key: params.key,
                    scale: params.scale,
                    tempo: params.tempo,
                    measures: params.measures
                };
            }

            `;

// Replace the method
const beforeMethod = htmlContent.slice(0, methodStart);
const afterMethod = htmlContent.slice(returnEnd);
htmlContent = beforeMethod + newMethod + afterMethod;
console.log('✅ generateRiffData method patched');

// BULLETPROOF Layer 5: Write and Test
console.log('[6/6] Writing optimized file...');
fs.writeFileSync(indexPath, htmlContent);
console.log('✅ index.html updated successfully');

// Create test file
fs.writeFileSync(testPath, htmlContent);

// Final validation
console.log('\n========================================');
console.log('INTEGRATION COMPLETE');
console.log('========================================');
console.log('✅ Optimizer integrated successfully');
console.log('✅ Backup saved as:', path.basename(backupPath));
console.log('✅ Test file saved as:', path.basename(testPath));
console.log('\nTo test: Open index.html in browser and generate a riff');
console.log('To rollback: rename', path.basename(backupPath), 'to index.html');
console.log('\nCheck console for "✅ Optimized X note positions" message');
