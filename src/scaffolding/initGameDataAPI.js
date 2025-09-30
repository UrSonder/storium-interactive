// src/scaffolding/initGameDataAPI.js
// Initializes gameDataAPI from middevelopmenttables.txt for use by scaffolding and UIX
(function(global) {
  'use strict';
  try {
    // Load DatabaseGrok
    if (!global.RelationalDb) throw new Error('RelationalDb (databasegrok.js) not loaded');
    const DatabaseDriver = global.RelationalDb.DatabaseDriver;
    // Load tables from middevelopmenttables.txt
    function fetchTableText(cb) {
      fetch('notes/middevelopmenttables.txt')
        .then(resp => resp.text())
        .then(txt => cb(null, txt))
        .catch(e => cb(e));
    }
    fetchTableText(function(err, txt) {
      if (err) {
        alert('Failed to load middevelopmenttables.txt: ' + (err.message || err));
        return;
      }
      const driver = new DatabaseDriver();
      driver.loadFromText(txt);
      global.gameDataAPI = driver.getDatabase();
      if (global.onGameDataAPILoaded) global.onGameDataAPILoaded();
    });
  } catch (e) {
    alert('initGameDataAPI failed: ' + (e && e.message ? e.message : e));
    if (window && window.console) console.error(e);
  }
})(window);
