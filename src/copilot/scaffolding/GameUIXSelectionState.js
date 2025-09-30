// src/scaffolding/GameUIXSelectionState.js
// Robust error handling included
(function(global) {
  'use strict';
  try {
    class GameUIXSelectionState {
      constructor() {
        this.selectedChallengeId = null;
        this.selectedCharacterId = null;
      }
      setSelectedChallenge(id) {
        this.selectedChallengeId = id;
      }
      setSelectedCharacter(id) {
        this.selectedCharacterId = id;
      }
      getSelectedChallenge() {
        return this.selectedChallengeId;
      }
      getSelectedCharacter() {
        return this.selectedCharacterId;
      }
      reset(sceneChallenges, sceneCharacters) {
        // Default to top challenge/character if available
        this.selectedChallengeId = sceneChallenges && sceneChallenges.length > 0 ? sceneChallenges[0].challenge.data[0] : null;
        this.selectedCharacterId = sceneCharacters && sceneCharacters.length > 0 ? sceneCharacters[0].data[0] : null;
      }
    }
    global.GameUIXSelectionState = GameUIXSelectionState;
  } catch (e) {
    alert('GameUIXSelectionState failed: ' + (e && e.message ? e.message : e));
    if (window && window.console) console.error(e);
  }
})(window);
