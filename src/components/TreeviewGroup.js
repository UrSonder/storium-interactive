// src/components/TreeviewGroup.js
(function(global) {
  'use strict';
  class TreeviewGroup {
    constructor({ getDb }) {
      this.getDb = getDb;
      this.el = this.render();
    }
    render() {
      const group = document.createElement('div');
      group.className = storiumStyleRegistry.getClassName('TreeviewGroup');
      this.container = document.createElement('div');
      group.appendChild(this.container);
      return group;
    }
    updateTree() {
      // Clear previous
      this.container.innerHTML = '';
      const db = this.getDb();
      if (!db) {
        this.container.textContent = 'No data loaded.';
        return;
      }
      // Example: Render games, scenes, characters
      const games = db.tables.getTable('tblGames');
      if (!games) {
        this.container.textContent = 'No games found.';
        return;
      }
      games.rows.data.forEach(gameRow => {
        const gameDiv = document.createElement('div');
        gameDiv.textContent = `Game: ${gameRow.data[1]}`;
        gameDiv.style.fontWeight = 'bold';
        this.container.appendChild(gameDiv);
        // Scenes for this game
        const scenes = db.tables.getTable('tblScenes');
        if (scenes) {
          scenes.rows.data.filter(sceneRow => sceneRow.data[6] === gameRow.data[0])
            .forEach(sceneRow => {
              const sceneDiv = document.createElement('div');
              sceneDiv.textContent = `Scene: ${sceneRow.data[1]}`;
              sceneDiv.style.marginLeft = '24px';
              this.container.appendChild(sceneDiv);
              // Characters for this scene
              const chars = db.tables.getTable('tblCharacters');
              if (chars) {
                chars.rows.data.filter(charRow => charRow.data[3] === sceneRow.data[0])
                  .forEach(charRow => {
                    const charDiv = document.createElement('div');
                    charDiv.textContent = `Character: ${charRow.data[1]}`;
                    charDiv.style.marginLeft = '48px';
                    this.container.appendChild(charDiv);
                  });
              }
            });
        }
      });
    }
    getElement() {
      return this.el;
    }
  }
  global.TreeviewGroup = TreeviewGroup;
})(window);
