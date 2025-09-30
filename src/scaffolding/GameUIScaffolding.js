// src/scaffolding/GameUIScaffolding.js
// Robust error handling included
(function(global) {
  'use strict';
  try {
    class GameUIScaffolding {
      constructor(gameDataAPI) {
        if (!gameDataAPI) throw new Error('GameUIScaffolding: gameDataAPI required');
        this.data = gameDataAPI;
      }
      // Get all challenges for a scene, with pip counts
      getChallengesWithPips(sceneId) {
        const challenges = this.data.getTable('tblChallenges').rows.data.filter(row => String(row.data[1]) === String(sceneId));
        const pipsTable = this.data.getTable('tblPipsperChallenge');
        return challenges.map(challenge => {
          const pipRow = pipsTable.rows.data.find(r => String(r.data[1]) === String(challenge.data[0]));
          return {
            challenge,
            pips: pipRow ? Number(pipRow.data[2]) : 0
          };
        });
      }
      // Get cards played on a challenge, ordered by id (can add pip_index later)
      getCardsPlayedOnChallenge(challengeId) {
        const played = this.data.getTable('tblCardsPlayedOnChallenges').rows.data.filter(row => String(row.data[1]) === String(challengeId));
        return played.map(row => row.data[2]); // CharacterwCards_id
      }
      // Get characters for a scene
      getCharacters(sceneId) {
        return this.data.getTable('tblCharacters').rows.data.filter(row => String(row.data[3]) === String(sceneId));
      }
      // Get card details by CharacterwCards_id
      getCardByCharacterwCardsId(id) {
        return this.data.getTable('tblCardsWTypesWCharacter').rows.data.find(row => String(row.data[0]) === String(id));
      }
      // ...add more as needed
    }
    global.GameUIScaffolding = GameUIScaffolding;
  } catch (e) {
    alert('GameUIScaffolding failed: ' + (e && e.message ? e.message : e));
    if (window && window.console) console.error(e);
  }
})(window);
