// Universal UI Improvements for GML Apps
(function() {
  // Auto-focus main button
  window.addEventListener('load', function() {
    const btn = document.querySelector('button[onclick*="generate"], button[onclick*="Generate"], .generate-btn, #generateBtn');
    if (btn) {
      btn.focus();
      console.log('Auto-focused main button');
    }
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    // Spacebar/Enter to generate
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      const btn = document.querySelector('button[onclick*="generate"], button[onclick*="Generate"]');
      if (btn) btn.click();
    }
    
    // R to regenerate
    if (e.code === 'KeyR') {
      const btn = document.querySelector('button[onclick*="generate"]');
      if (btn) btn.click();
    }
  });
  
  console.log('UI Improvements loaded: Space=Generate, R=Regenerate');
})();
