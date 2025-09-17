/**
 * Batch Operations for GML Apps
 * Generate multiple options at once
 */

class BatchOperations {
  constructor(generateFunction, displayFunction) {
    this.generateFn = generateFunction;
    this.displayFn = displayFunction;
    this.results = [];
    this.currentIndex = 0;
  }
  
  // Create UI controls
  createBatchUI(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('Container not found:', containerId);
      return;
    }
    
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px;';
    
    // Quantity selector
    const label = document.createElement('label');
    label.textContent = 'Generate: ';
    label.style.marginRight = '10px';
    
    const select = document.createElement('select');
    select.id = 'batchQuantity';
    select.style.cssText = 'padding: 5px; font-size: 16px; margin-right: 10px;';
    
    [1, 3, 5, 10].forEach(num => {
      const option = document.createElement('option');
      option.value = num;
      option.textContent = `${num} ${num === 1 ? 'option' : 'options'}`;
      select.appendChild(option);
    });
    
    // Generate button
    const generateBtn = document.createElement('button');
    generateBtn.textContent = 'Generate Batch';
    generateBtn.style.cssText = `
      padding: 10px 20px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    `;
    
    generateBtn.onclick = () => this.generateBatch();
    
    wrapper.appendChild(label);
    wrapper.appendChild(select);
    wrapper.appendChild(generateBtn);
    
    // Results display area
    const resultsArea = document.createElement('div');
    resultsArea.id = 'batchResults';
    resultsArea.style.cssText = 'margin-top: 20px;';
    
    container.appendChild(wrapper);
    container.appendChild(resultsArea);
  }
  
  // Generate multiple results
  async generateBatch() {
    const quantity = parseInt(document.getElementById('batchQuantity').value);
    const resultsArea = document.getElementById('batchResults');
    
    // Clear previous results
    this.results = [];
    resultsArea.innerHTML = '<p>Generating...</p>';
    
    // Generate with slight delay for UI update
    for (let i = 0; i < quantity; i++) {
      await this.delay(50); // Small delay for UI responsiveness
      
      try {
        const result = await this.generateFn();
        this.results.push(result);
        
        // Update progress
        resultsArea.innerHTML = `<p>Generated ${i + 1} of ${quantity}...</p>`;
      } catch (e) {
        console.error('Generation error:', e);
      }
    }
    
    // Display all results
    this.displayResults();
  }
  
  // Display results with selection buttons
  displayResults() {
    const resultsArea = document.getElementById('batchResults');
    resultsArea.innerHTML = '';
    
    if (this.results.length === 0) {
      resultsArea.innerHTML = '<p>No results generated</p>';
      return;
    }
    
    // Create container for each result
    this.results.forEach((result, index) => {
      const resultDiv = document.createElement('div');
      resultDiv.style.cssText = `
        border: 2px solid #ddd;
        padding: 10px;
        margin: 10px 0;
        border-radius: 5px;
        background: white;
      `;
      
      // Result header
      const header = document.createElement('div');
      header.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';
      
      const title = document.createElement('h3');
      title.textContent = `Option ${index + 1}`;
      title.style.margin = '0';
      
      // Action buttons
      const btnContainer = document.createElement('div');
      
      const useBtn = document.createElement('button');
      useBtn.textContent = 'Use This';
      useBtn.style.cssText = `
        padding: 5px 15px;
        background: #2196F3;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        margin-left: 5px;
      `;
      useBtn.onclick = () => this.selectResult(index);
      
      const playBtn = document.createElement('button');
      playBtn.textContent = 'Preview';
      playBtn.style.cssText = `
        padding: 5px 15px;
        background: #FF9800;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
      `;
      playBtn.onclick = () => this.previewResult(index);
      
      btnContainer.appendChild(playBtn);
      btnContainer.appendChild(useBtn);
      
      header.appendChild(title);
      header.appendChild(btnContainer);
      
      // Result content
      const content = document.createElement('div');
      content.style.cssText = 'margin-top: 10px;';
      
      // Let the display function handle the content
      if (this.displayFn) {
        content.innerHTML = this.displayFn(result);
      } else {
        content.innerHTML = '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
      }
      
      resultDiv.appendChild(header);
      resultDiv.appendChild(content);
      resultsArea.appendChild(resultDiv);
    });
  }
  
  // Select a result to use
  selectResult(index) {
    this.currentIndex = index;
    const result = this.results[index];
    
    // Highlight selected
    const allDivs = document.querySelectorAll('#batchResults > div');
    allDivs.forEach(div => div.style.border = '2px solid #ddd');
    if (allDivs[index]) {
      allDivs[index].style.border = '2px solid #4CAF50';
    }
    
    // Callback or event
    if (window.onBatchSelect) {
      window.onBatchSelect(result);
    }
    
    // Save to cross-app memory if available
    if (window.GMLMemory) {
      const memory = new GMLMemory('BatchOperation');
      memory.save(result, 'batch-selection');
    }
  }
  
  // Preview result (if audio)
  previewResult(index) {
    const result = this.results[index];
    if (window.onBatchPreview) {
      window.onBatchPreview(result);
    }
  }
  
  // Helper delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Make globally available
if (typeof window !== 'undefined') {
  window.BatchOperations = BatchOperations;
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BatchOperations;
}
