// UI Speed Improvements - Makes app feel faster
function addUIImprovements() {
  // Auto-focus main button
  window.addEventListener('load', function() {
    const btn = document.querySelector('button');
    if (btn) btn.focus();
  });
  
  // Spacebar to generate
  document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
      e.preventDefault();
      const btn = document.querySelector('button');
      if (btn) btn.click();
    }
  });
}
addUIImprovements();
