// src/RobustAppLoader.js
// Loads AppLoader with robust error handling and visible fallback
class RobustAppLoader {
  constructor(rootId = 'app-root') {
    try {
      this.appLoader = new window.AppLoader(rootId);
    } catch (e) {
      this.showError(e);
    }
  }
  showError(e) {
    let root = document.getElementById('app-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'app-root';
      document.body.appendChild(root);
    }
    while (root.firstChild) root.removeChild(root.firstChild);
    const errorDiv = document.createElement('div');
    errorDiv.style.color = 'red';
    errorDiv.style.fontSize = '1.5em';
    errorDiv.style.padding = '2em';
    errorDiv.style.background = '#fff0f0';
    errorDiv.style.border = '2px solid #f00';
    errorDiv.style.borderRadius = '8px';
    errorDiv.textContent = 'App failed to load: ' + (e && e.message ? e.message : e);
    root.appendChild(errorDiv);
    alert('App failed to load: ' + (e && e.message ? e.message : e));
  }
}
window.RobustAppLoader = RobustAppLoader;
