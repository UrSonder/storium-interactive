// src/SafeAppLoader.js
// Loads AppLoader and alerts on any error
class SafeAppLoader {
  constructor(rootId = 'app-root') {
    try {
      this.appLoader = new window.AppLoader(rootId);
    } catch (e) {
      alert('AppLoader failed: ' + (e && e.message ? e.message : e));
    }
  }
}
window.SafeAppLoader = SafeAppLoader;
