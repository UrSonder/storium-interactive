// src/AppLoader.js
// Minimal AppLoader class for modular UI (not IIFE)
class AppLoader {
  constructor(rootId = 'app-root') {
    try {
      this.root = document.getElementById(rootId);
      if (!this.root) throw new Error('Root element not found. App cannot start.');
      while (this.root.firstChild) this.root.removeChild(this.root.firstChild);

      // --- Data setup ---
      this.dbDriver = new window.RelationalDb.DatabaseDriver();
      // Load sample data (replace with your middevtables or real data as needed)
      const sampleText = `tblGames\n1|Sample Game\ntblScenes\n1|Opening Scene||||||1\ntblChallenges\n1|1|Challenge 1||||\ntblCharacters\n1|Hero|Player|1||\n`;
      this.dbDriver.loadFromText(sampleText);
      this.db = this.dbDriver.getDatabase();
      this.gameState = window.GameAPI ? window.GameAPI() : null;
      this.selection = { game: null, scene: null };

      // --- UI setup ---
      this.tabGroup = new window.TabGroup({
        onTabChange: (tabId) => this.switchTab(tabId)
      });
      this.root.appendChild(this.tabGroup.getElement());

      this.contentContainer = document.createElement('div');
      this.contentContainer.style.marginTop = '2em';
      this.root.appendChild(this.contentContainer);

      this.editorGroup = new window.EditorGroup({
        onParse: (text) => this.loadTextToDb(text),
        onBuild: () => this.buildTextFromDb(),
        initialText: sampleText
      });

      this.treeviewGroup = new window.TreeviewGroup({
        getDb: () => this.db,
        onCrud: (action, payload) => this.handleCrud(action, payload),
        getSelection: (key) => this.selection[key],
        setSelection: (key, value) => { this.selection[key] = value; }
      });

      // Start on tree tab
      this.switchTab('tree');
    } catch (e) {
      this.showError(e);
    }
  }

  switchTab(tabId) {
    try {
      this.contentContainer.innerHTML = '';
      if (tabId === 'tree') {
        this.treeviewGroup.updateTree();
        this.contentContainer.appendChild(this.treeviewGroup.getElement());
      } else if (tabId === 'editor') {
        this.contentContainer.appendChild(this.editorGroup.getElement());
      }
    } catch (e) {
      this.showError(e);
    }
  }

  loadTextToDb(text) {
    try {
      this.dbDriver = new window.RelationalDb.DatabaseDriver();
      this.dbDriver.loadFromText(text);
      this.db = this.dbDriver.getDatabase();
      if (this.gameState && this.gameState.loadFromDb) {
        this.gameState.loadFromDb(this.db);
      }
      this.treeviewGroup.updateTree();
      this.switchTab('tree');
    } catch (e) {
      this.showError(e);
    }
  }

  buildTextFromDb() {
    try {
      const text = this.dbDriver.exportToText();
      this.editorGroup.setText(text);
      this.switchTab('editor');
    } catch (e) {
      this.showError(e);
    }
  }

  handleCrud(action, payload) {
    try {
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
        table.rows.update(id, this.makeUpdateObj(table, data));
      } else if (action === 'delete') {
        table.rows.delete(id);
      } else if (action === 'create') {
        const obj = this.makeUpdateObj(table, data, true);
        table.rows.add(obj);
      }
      if (this.gameState && this.gameState.loadFromDb) {
        this.gameState.loadFromDb(this.db);
      }
      this.treeviewGroup.updateTree();
    } catch (e) {
      this.showError(e);
    }
  }

  makeUpdateObj(table, data, isAdd = false) {
    const obj = {};
    for (let i = 0; i < table.columns.names.length; ++i) {
      const col = table.columns.names[i];
      if (isAdd && i === 0) continue; // skip id for add
      obj[col] = data[i];
    }
    return obj;
  }

  showError(e) {
    let root = this.root || document.getElementById('app-root');
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
window.AppLoader = AppLoader;
