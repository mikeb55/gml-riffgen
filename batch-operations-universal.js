// Universal Batch Operations for GML Apps
function initBatchOperations(generateFunction) {
  const container = document.createElement('div');
  container.innerHTML = `
    <div style="background:#f5f5f5; padding:15px; border-radius:5px; margin:20px 0;">
      <select id="batchQty" style="padding:5px; margin:0 10px;">
        <option value="1">1 option</option>
        <option value="3">3 options</option>
        <option value="5">5 options</option>
        <option value="10">10 options</option>
      </select>
      <button onclick="runBatch()" style="padding:5px 15px; background:#4CAF50; color:white; border:none; border-radius:3px;">
        Generate Options
      </button>
      <div id="batchResults"></div>
    </div>
  `;
  
  // Find main content area or body
  const target = document.getElementById('controls') || 
                 document.querySelector('main') || 
                 document.body;
  target.appendChild(container);
  
  window.runBatch = async function() {
    const qty = document.getElementById('batchQty').value;
    const results = document.getElementById('batchResults');
    results.innerHTML = 'Generating...';
    
    const outputs = [];
    for(let i = 0; i < qty; i++) {
      outputs.push(await generateFunction());
    }
    
    results.innerHTML = '';
    outputs.forEach((output, i) => {
      const div = document.createElement('div');
      div.style.cssText = 'border:1px solid #ddd; padding:10px; margin:10px 0;';
      div.innerHTML = `<h4>Option ${i+1}</h4>`;
      const btn = document.createElement('button');
      btn.textContent = 'Use This';
      btn.onclick = () => window.selectBatchOption && window.selectBatchOption(output);
      div.appendChild(btn);
      results.appendChild(div);
    });
  };
}
