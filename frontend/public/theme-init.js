(function(){
  try {
    var t = localStorage.getItem('theme');
    if(t === 'dark'){ document.documentElement.classList.add('dark'); }
    else { document.documentElement.classList.remove('dark'); }
    
    // ANTI-FLASH GUARD: Hide any body content that appears before React is ready on graph page
    if (window.location.pathname === '/graf') {
      var style = document.createElement('style');
      style.innerHTML = 'body { visibility: hidden !important; background: ' + (t === 'dark' ? '#020617' : '#F8FAFC') + ' !important; }';
      style.id = 'anti-fouc-style';
      document.head.appendChild(style);
    }
  } catch(e) {}
})();
