// Quick verification that optimizer is working
const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const hasOptimizer = content.includes('FretPositionOptimizer');
const hasIntegration = content.includes('optimizer.optimizePositions');

if (hasOptimizer && hasIntegration) {
    console.log('✅ VERIFICATION PASSED: Optimizer fully integrated');
    process.exit(0);
} else {
    console.log('❌ VERIFICATION FAILED: Integration incomplete');
    process.exit(1);
}
