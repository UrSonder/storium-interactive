// src/HubLoader.js
// Dynamically loads all required scripts for the app, then instantiates RobustAppLoader
class HubLoader {
  constructor(options = {}) {
    // Strict dependency order:
    // 1. CSS management
    // 2. Data libraries
    // 3. Style registry
    // 4. UI components
    // 5. App logic
    this.scripts = [
      'lib/css-management/css-management.js',
      'src/style-groups.js',
      'lib/databasegrok/databasegrok.js',
      'lib/storiumgamestate/storiumgamestate.js',
      'src/components/TabGroup.js',
      'src/components/EditorGroup.js',
      'src/components/TreeviewGroup.js',
      'main.js',
  'src/AppLoader.js'
    ];
    this.rootId = options.rootId || 'app-root';
    this.loadAll().then(() => {
      if (window.RobustAppLoader) {
        window.robustAppLoader = new window.RobustAppLoader(this.rootId);
      }
    }).catch(e => {
      this.showError('HubLoader failed: ' + (e && e.message ? e.message : e));
    });
  }
  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        this.showError('Failed to load script: ' + src);
        reject(new Error('Failed to load ' + src));
      };
      document.body.appendChild(script);
    });
  }
  async loadAll() {
    for (const src of this.scripts) {
      try {
        await this.loadScript(src);
      } catch (e) {
        throw e;
      }
    }
  }
  showError(msg) {
    alert(msg);
    let root = document.getElementById(this.rootId);
    if (!root) {
      root = document.createElement('div');
      root.id = this.rootId;
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
    errorDiv.textContent = msg;
    root.appendChild(errorDiv);
  }
}
window.HubLoader = HubLoader;
