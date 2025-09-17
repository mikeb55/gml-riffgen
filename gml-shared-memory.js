/**
 * GML Cross-App Memory System
 * Share data between all GML apps seamlessly
 */

class GMLMemory {
  constructor(appName) {
    this.appName = appName;
    this.storageKey = 'gmlLastExport';
    this.historyKey = 'gmlHistory';
    this.maxHistorySize = 10;
    this.isAvailable = this.checkStorage();
  }
  
  // Check if localStorage is available
  checkStorage() {
    try {
      const test = '__gmlTest__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch(e) {
      console.warn('localStorage not available:', e.message);
      return false;
    }
  }
  
  // Save data with metadata
  save(data, type = 'midi') {
    if (!this.isAvailable) {
      console.warn('Cannot save - localStorage unavailable');
      return false;
    }
    
    try {
      const wrapper = {
        app: this.appName,
        type: type,
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: data
      };
      
      // Save as last export
      localStorage.setItem(this.storageKey, JSON.stringify(wrapper));
      
      // Add to history
      this.addToHistory(wrapper);
      
      // Show success feedback
      this.showNotification('Data saved for other apps!', 'success');
      
      return true;
    } catch(e) {
      if (e.name === 'QuotaExceededError') {
        console.error('localStorage full - clearing old data');
        this.clearOldData();
        return this.save(data, type); // Retry once
      }
      console.error('Save failed:', e);
      return false;
    }
  }
  
  // Load last export from any app
  load() {
    if (!this.isAvailable) return null;
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return null;
      
      const wrapper = JSON.parse(stored);
      
      // Validate structure
      if (!wrapper.data || !wrapper.app) {
        console.warn('Invalid stored data structure');
        return null;
      }
      
      // Show where data came from
      this.showNotification(`Loaded from ${wrapper.app}`, 'info');
      
      return wrapper;
    } catch(e) {
      console.error('Load failed:', e);
      return null;
    }
  }
  
  // Add to history (keep last 10)
  addToHistory(wrapper) {
    try {
      let history = this.getHistory();
      history.unshift(wrapper);
      history = history.slice(0, this.maxHistorySize);
      localStorage.setItem(this.historyKey, JSON.stringify(history));
    } catch(e) {
      console.warn('Could not update history:', e);
    }
  }
  
  // Get full history
  getHistory() {
    try {
      const history = localStorage.getItem(this.historyKey);
      return history ? JSON.parse(history) : [];
    } catch(e) {
      return [];
    }
  }
  
  // Clear old data if storage full
  clearOldData() {
    const history = this.getHistory();
    if (history.length > 5) {
      localStorage.setItem(this.historyKey, JSON.stringify(history.slice(0, 5)));
    }
  }
  
  // Show temporary notification
  showNotification(message, type = 'info') {
    // Skip if no DOM
    if (typeof document === 'undefined') return;
    
    const notif = document.createElement('div');
    notif.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
      color: white;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    notif.textContent = message;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notif);
    
    // Auto remove
    setTimeout(() => {
      notif.style.opacity = '0';
      setTimeout(() => notif.remove(), 300);
    }, 3000);
  }
  
  // Create import button UI
  createImportButton(targetElementId, callback) {
    const container = document.getElementById(targetElementId);
    if (!container) {
      console.warn(`Element ${targetElementId} not found`);
      return;
    }
    
    const button = document.createElement('button');
    button.textContent = '📥 Import Last';
    button.style.cssText = `
      padding: 8px 16px;
      margin: 5px;
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    `;
    
    button.onclick = () => {
      const data = this.load();
      if (data) {
        callback(data);
      } else {
        this.showNotification('No saved data found', 'info');
      }
    };
    
    container.appendChild(button);
    
    // Check if data available
    const hasData = this.load() !== null;
    button.disabled = !hasData;
    if (!hasData) {
      button.style.opacity = '0.5';
      button.style.cursor = 'not-allowed';
    }
  }
}

// Make globally available
if (typeof window !== 'undefined') {
  window.GMLMemory = GMLMemory;
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GMLMemory;
}
