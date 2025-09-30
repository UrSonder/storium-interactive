// main.js
// Entry point for Storium Game State Interactive WebApp

(function() {
  'use strict';

  // Ensure libraries are loaded
  if (!window.StyleRegistry || !window.RelationalDb || !window.GameAPI) {
    console.error('Essential libraries are missing.');
    return;
  }

  // StyleRegistry is initialized in style-groups.js and attached to window.storiumStyleRegistry
  if (!window.storiumStyleRegistry) {
    throw new Error('StyleRegistry not initialized.');
  }

  // DOM root
  const root = document.getElementById('app-root');
  if (!root) {
    throw new Error('Root element not found');
  }

  // Scaffold/controller class to mediate UI and data

  class AppController {
    constructor(root) {
      this.root = root;
      this.dbDriver = new window.RelationalDb.DatabaseDriver();
      this.db = null;
      this.gameState = window.GameAPI ? window.GameAPI() : null;
      this.activeTab = 'tree';
      this.init();
    }

    init() {
      // Clear root
      this.root.innerHTML = '';

      // Tab group
      this.tabGroup = new window.TabGroup({
        onTabChange: (tabId) => this.switchTab(tabId)
      });
      this.root.appendChild(this.tabGroup.getElement());

      // Content container
      this.contentContainer = document.createElement('div');
      this.contentContainer.className = window.storiumStyleRegistry.getClassName('TabContent');
      this.root.appendChild(this.contentContainer);

      // Editor group (Tab 2)
      this.editorGroup = new window.EditorGroup({
        onParse: (text) => this.loadTextToDb(text),
        onBuild: () => this.buildTextFromDb(),
        initialText: ''
      });

      // Treeview group (Tab 1)
      this.treeviewGroup = new window.TreeviewGroup({
        getDb: () => this.db,
        onCrud: (action, payload) => this.handleCrud(action, payload)
      });

      // Start on tree tab
      this.switchTab('tree');
    }

    switchTab(tabId) {
      this.activeTab = tabId;
      this.contentContainer.innerHTML = '';
      if (tabId === 'tree') {
        this.treeviewGroup.updateTree();
        this.contentContainer.appendChild(this.treeviewGroup.getElement());
      } else if (tabId === 'editor') {
        this.contentContainer.appendChild(this.editorGroup.getElement());
      }
    }

    loadTextToDb(text) {
      this.dbDriver = new window.RelationalDb.DatabaseDriver();
      this.dbDriver.loadFromText(text);
      this.db = this.dbDriver.getDatabase();
      // Optionally, sync to storiumgamestate here
      if (this.gameState && this.gameState.loadFromDb) {
        this.gameState.loadFromDb(this.db);
      }
      this.treeviewGroup.updateTree();
      this.switchTab('tree');
    }

    buildTextFromDb() {
      // Not implemented: would serialize db back to text
      // Placeholder: just show a message
      this.editorGroup.setText('// TODO: Implement DB to text serialization');
      this.switchTab('editor');
    }

    // All CRUD/data operations go through storiumgamestate
    handleCrud(action, payload) {
      if (!this.gameState) return;
      // Example: this.gameState.doCrud(action, payload)
      // You would implement methods like createGame, updateScene, etc. in storiumgamestate
      // and call them here based on action/payload
      // After mutation, update the treeview
      this.treeviewGroup.updateTree();
    }
  }

  // Instantiate the app
  window.storiumApp = new AppController(root);

})();
