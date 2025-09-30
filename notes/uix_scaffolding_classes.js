// UIX Scaffolding Classes for Storium Interactive
// These classes/interfaces ensure strict separation of UIX (presentation/interaction) and Data (game state, tables, CRUD logic)

// --- DATA LAYER ---
// Only handles data, no UI logic
class GameDataAPI {
  // CRUD for all tables (games, scenes, characters, cards, etc)
  getTable(tableName) {}
  createRow(tableName, rowData) {}
  updateRow(tableName, rowId, rowData) {}
  deleteRow(tableName, rowId) {}
  // ...other data logic
}

// --- SCAFFOLDING LAYER ---
// Mediates between UIX and Data, exposes only what UIX needs
class GameUIScaffolding {
  constructor(gameDataAPI) {
    this.data = gameDataAPI;
  }
  // Provide filtered, UI-ready data
  getGames() { return this.data.getTable('tblGames'); }
  getScenes(gameId) { /* ... */ }
  getCharacters(sceneId) { /* ... */ }
  getCards(sceneId) { /* ... */ }
  getChallenges(sceneId) { /* ... */ }
  // Provide CRUD methods for UIX
  createCharacter(sceneId, data) { /* ... */ }
  updateCharacter(id, data) { /* ... */ }
  deleteCharacter(id) { /* ... */ }
  // ...repeat for cards, challenges, etc
}

// --- UIX LAYER ---
// Only handles presentation and user interaction, never touches data directly
class GameUIX {
  constructor(scaffolding) {
    this.scaffold = scaffolding;
  }
  renderTabs() { /* ... */ }
  renderTreeView() { /* ... */ }
  renderEditorView() { /* ... */ }
  // All UI events call scaffolding methods, never data directly
}

// Usage:
// const dataAPI = new GameDataAPI();
// const scaffold = new GameUIScaffolding(dataAPI);
// const uix = new GameUIX(scaffold);
// uix.renderTabs();
