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
      'src/ErrorCollector.js',
      'lib/css-management/css-management.js',
      'src/css/CssFactory.js',
      'src/style-groups.js',
      'lib/databasegrok/databasegrok.js',
      'src/scaffolding/initGameDataAPI.js',
      'src/scaffolding/GameUIScaffolding.js',
      'src/scaffolding/GameUIXSelectionState.js',
      'lib/storiumgamestate/storiumgamestate.js',
      'src/components/TabGroup.js',
      'src/components/EditorGroup.js',
      'src/components/TreeviewGroup.js',
      'src/components/EnhancedTreeviewGroup.js',
      'main.js',
      'src/AppLoader.js'
    ];
    this.rootId = options.rootId || 'app-root';
    this.loadAll().then(() => {
      // Wait for gameDataAPI to be loaded (initGameDataAPI.js sets window.onGameDataAPILoaded)
      if (window.gameDataAPI) {
        this.startApp();
      } else if (typeof window.onGameDataAPILoaded === 'function') {
        window.onGameDataAPILoaded = () => this.startApp();
      } else {
        // fallback: poll for up to 2s
        let waited = 0;
        const poll = () => {
          if (window.gameDataAPI) return this.startApp();
          waited += 50;
          if (waited > 2000) return this.showError('gameDataAPI failed to load');
          setTimeout(poll, 50);
        };
        poll();
      }
    }).catch(e => {
      if (window.FallbackLoader) {
        window.fallbackLoader = new window.FallbackLoader(this.rootId);
      } else {
        this.showError('HubLoader failed: ' + (e && e.message ? e.message : e));
      }
    });

  }

  startApp() {
    if (window.AppLoader) {
      window.appLoader = new window.AppLoader(this.rootId);
    } else if (window.FallbackLoader) {
      window.fallbackLoader = new window.FallbackLoader(this.rootId);
    } else {
      this.showError('AppLoader and FallbackLoader missing');
    }
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
    const cssFactory = new window.CssFactory();
    const dh = cssFactory.getDomHandler();
    const errorDiv = dh.createElement('div', [cssFactory.getClass('error')], {}, {innerText: msg});
    root.appendChild(errorDiv);
  }
}
window.HubLoader = HubLoader;
