// Simplified Batch Operations that actually works
function createBatchControls(containerId, generateFunc) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Create controls
  const html = `
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <label>Generate: </label>
      <select id="batchQty" style="padding: 5px; margin: 0 10px;">
        <option value="1">1 option</option>
        <option value="3">3 options</option>
        <option value="5">5 options</option>
        <option value="10">10 options</option>
      </select>
      <button onclick="generateBatch()" style="padding: 5px 15px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer;">
        Generate Options
      </button>
    </div>
    <div id="batchResults"></div>
  `;
  
  container.innerHTML = html;
  
  // Make generate function global
  window.generateBatch = async function() {
    const qty = document.getElementById('batchQty').value;
    const resultsDiv = document.getElementById('batchResults');
    resultsDiv.innerHTML = '<p>Generating...</p>';
    
    const results = [];
    
    // Generate multiple options
    for(let i = 0; i < qty; i++) {
      await new Promise(r => setTimeout(r, 50)); // Small delay for UI
      const result = generateFunc();
      results.push(result);
    }
    
    // Display results
    resultsDiv.innerHTML = '';
    results.forEach((result, index) => {
      const optionDiv = document.createElement('div');
      optionDiv.style.cssText = 'border: 2px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; background: white;';
      
      // Header
      const header = document.createElement('div');
      header.innerHTML = '<h3 style="margin-top: 0;">Option ' + (index + 1) + '</h3>';
      
      // Content
      const content = document.createElement('div');
      content.innerHTML = formatResult(result);
      
      // Buttons
      const btnDiv = document.createElement('div');
      btnDiv.style.marginTop = '10px';
      
      const useBtn = document.createElement('button');
      useBtn.textContent = 'Use This';
      useBtn.style.cssText = 'padding: 5px 15px; background: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer; margin-right: 10px;';
      useBtn.onclick = function() {
        selectOption(result, index);
        // Highlight selected
        document.querySelectorAll('#batchResults > div').forEach(d => d.style.border = '2px solid #ddd');
        optionDiv.style.border = '2px solid #4CAF50';
      };
      
      const previewBtn = document.createElement('button');
      previewBtn.textContent = 'Preview';
      previewBtn.style.cssText = 'padding: 5px 15px; background: #FF9800; color: white; border: none; border-radius: 3px; cursor: pointer;';
      previewBtn.onclick = function() {
        previewOption(result, index);
      };
      
      btnDiv.appendChild(useBtn);
      btnDiv.appendChild(previewBtn);
      
      optionDiv.appendChild(header);
      optionDiv.appendChild(content);
      optionDiv.appendChild(btnDiv);
      resultsDiv.appendChild(optionDiv);
    });
  };
  
  // Format result for display
  window.formatResult = function(result) {
    if (result.notes) {
      return '<p>Notes: ' + result.notes.join(', ') + '</p>';
    }
    return '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
  };
  
  // Handle selection
  window.selectOption = function(result, index) {
    console.log('Selected option', index + 1, result);
    
    // Save to memory if available
    if (window.GMLMemory) {
      const memory = new GMLMemory('BatchSelect');
      memory.save(result, 'selection');
    }
    
    // Call app-specific handler if exists
    if (window.onBatchSelect) {
      window.onBatchSelect(result);
    }
  };
  
  // Preview
  window.previewOption = function(result, index) {
    console.log('Preview option', index + 1, result);
    
    if (window.onBatchPreview) {
      window.onBatchPreview(result);
    } else {
      alert('Preview: ' + JSON.stringify(result).substring(0, 100));
    }
  };
}
