// RAPID COMPOSER MEMORY SYSTEM
// Remembers everything good across all apps

class RapidComposerMemory {
    constructor() {
        this.maxHistory = 10;
        this.favorites = new Set();
    }
    
    // Save ANY generation from ANY app
    save(data, appName, tags = []) {
        const entry = {
            id: Date.now(),
            app: appName,
            data: data,
            tags: tags,
            timestamp: new Date().toISOString(),
            bpm: data.tempo || 120,
            key: data.key || 'C',
            favorite: false
        };
        
        let history = this.getHistory();
        history.unshift(entry);
        history = history.slice(0, this.maxHistory);
        localStorage.setItem('gml_rapid_history', JSON.stringify(history));
        
        // Also save to quick-access slot
        localStorage.setItem('gml_last_generation', JSON.stringify(entry));
        
        return entry.id;
    }
    
    // Get history for rapid reuse
    getHistory() {
        return JSON.parse(localStorage.getItem('gml_rapid_history') || '[]');
    }
    
    // Get last generation (for instant reuse)
    getLast() {
        return JSON.parse(localStorage.getItem('gml_last_generation') || 'null');
    }
    
    // Get by specific app
    getByApp(appName) {
        return this.getHistory().filter(h => h.app === appName);
    }
    
    // Favorite for quick access
    toggleFavorite(id) {
        let history = this.getHistory();
        history = history.map(h => {
            if (h.id === id) h.favorite = !h.favorite;
            return h;
        });
        localStorage.setItem('gml_rapid_history', JSON.stringify(history));
    }
    
    // Get favorites only
    getFavorites() {
        return this.getHistory().filter(h => h.favorite);
    }
    
    // Combine multiple generations
    combine(ids) {
        const history = this.getHistory();
        const combined = {
            type: 'combined',
            sources: [],
            data: {}
        };
        
        ids.forEach(id => {
            const entry = history.find(h => h.id === id);
            if (entry) {
                combined.sources.push(entry.app);
                Object.assign(combined.data, entry.data);
            }
        });
        
        return combined;
    }
    
    // Quick-load into current app
    loadIntoCurrentApp(id) {
        const entry = this.getHistory().find(h => h.id === id);
        if (entry && window.currentComposition) {
            Object.assign(window.currentComposition, entry.data);
            return true;
        }
        return false;
    }
}

// Auto-inject into all apps
window.RCM = new RapidComposerMemory();

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+S = Save current
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (window.currentComposition || window.currentPiece) {
            const data = window.currentComposition || window.currentPiece;
            const id = window.RCM.save(data, document.title);
            console.log('Saved to rapid memory:', id);
        }
    }
    
    // Ctrl+L = Load last
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        const last = window.RCM.getLast();
        if (last) {
            console.log('Loading last generation from', last.app);
            window.currentComposition = last.data;
            if (window.displayResult) window.displayResult(last.data);
        }
    }
    
    // Ctrl+H = Show history
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        const history = window.RCM.getHistory();
        console.table(history);
    }
});

console.log('🚀 Rapid Composer Memory Active!');
console.log('Shortcuts: Ctrl+S (save), Ctrl+L (load last), Ctrl+H (history)');
