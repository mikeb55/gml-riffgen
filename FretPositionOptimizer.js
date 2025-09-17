/**
 * BULLETPROOF Fret Position Optimizer for GML-RiffGen
 * Ensures playable guitar TAB generation
 * @version 1.2.1
 */

class FretPositionOptimizer {
    constructor() {
        this.tuning = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];
        this.midiTuning = [40, 45, 50, 55, 59, 64];
        this.MAX_STRETCH = 4;
        this.PREFERRED_POSITION_RANGE = [0, 12];
        this.MAX_FRET = 19;
    }

    findOptimalPosition(midiNote, previousFret = -1, previousString = -1) {
        const candidates = [];
        
        for (let string = 0; string < 6; string++) {
            const fret = midiNote - this.midiTuning[string];
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
                const stringJump = Math.abs(string - previousString);
                score -= stringJump * 2;
            }
            
            candidates.push({ string, fret, score });
        }
        
        if (candidates.length === 0) {
            return { string: 0, fret: 0, error: true };
        }
        
        candidates.sort((a, b) => b.score - a.score);
        return candidates[0];
    }
}

console.log('FretPositionOptimizer loaded successfully');
module.exports = FretPositionOptimizer;
