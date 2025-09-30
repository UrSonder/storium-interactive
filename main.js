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
    document.body.innerHTML = '<div style="color:red;font-size:2em;">Error: Root element not found. App cannot start.</div>';
    return;
  }
  // Show attempt counter in root
  if (!window._storiumAttempt) window._storiumAttempt = 1;
  else window._storiumAttempt++;
  // Show attempt counter and Hello World
  root.innerHTML = '<div style="font-size:1.2em;color:#888;">attempt #' + window._storiumAttempt + '</div>' +
    '<div style="font-size:2em;color:#222;margin-top:1em;">Hello World</div>';

  // Scaffold/controller class to mediate UI and data

  class AppController {
    constructor(root) {
      this.root = root;
      this.dbDriver = new window.RelationalDb.DatabaseDriver();
      this.db = null;
      this.gameState = window.GameAPI ? window.GameAPI() : null;
      this.activeTab = 'tree';
      this.selection = { game: null, scene: null };
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
        onCrud: (action, payload) => this.handleCrud(action, payload),
        getSelection: (key) => this.selection[key],
        setSelection: (key, value) => { this.selection[key] = value; }
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
      // Serialize the in-memory database back to text format
      if (!this.dbDriver) return '';
      let result = '';
      try {
        result = this.dbDriver.buildText();
      } catch (e) {
        this.showStatus('Failed to serialize database: ' + (e.message || e), 'error');
      }
      return result.trim();
    }

    // Show status to user (simple alert for now, can be improved)
    showStatus(message, type) {
      // type: 'success' | 'error'
      // For now, use alert. Replace with a better UI feedback system as needed.
      if (type === 'error') {
        alert('Error: ' + message);
      } else {
        // Optionally, show a non-blocking message
        // alert(message);
        console.log(message);
      }
    }

    // All CRUD/data operations go through storiumgamestate
    handleCrud(action, payload) {
      if (!this.db) return;
      const { entityType, id, data } = payload;
      const tableMap = {
        game: 'tblGames',
        scene: 'tblScenes',
        challenge: 'tblChallenges',
        character: 'tblCharacters'
      };
      const tableName = tableMap[entityType];
      if (!tableName) return;
      const table = this.db.tables.getTable(tableName);
      if (!table) return;
      if (action === 'update') {
        // id is always first field
        table.rows.update(id, this.makeUpdateObj(table, data));
        this.showStatus('Updated ' + entityType, 'success');
      } else if (action === 'delete') {
        table.rows.delete(id);
        this.showStatus('Deleted ' + entityType, 'success');
      } else if (action === 'create') {
        // data is array, skip id (auto)
        const obj = this.makeUpdateObj(table, data, true);
        table.rows.add(obj);
        this.showStatus('Created ' + entityType, 'success');
      }
      this.treeviewGroup.updateTree();
    }

    makeUpdateObj(table, data, isAdd = false) {
      // Map data array to column names
      const obj = {};
      for (let i = 0; i < table.columns.names.length; ++i) {
        const col = table.columns.names[i];
        if (isAdd && i === 0) continue; // skip id for add
        obj[col] = data[i];
      }
      return obj;
    }
  }

  // Instantiate the app
  try {
    window.storiumApp = new AppController(root);
  } catch (e) {
    root.innerHTML = '<div style="color:red;font-size:1.5em;">App failed to load: ' + (e.message || e) + '</div>';
  }

})();
