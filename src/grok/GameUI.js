(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GameUI = {}));
})(this, function (exports) {
  'use strict';

  class GameUI {
    constructor(scaffold) {
      this.scaffold = scaffold;
      this.selectedGameId = null;
      this.selectedSceneId = null;
      this.selectedChallengeId = null;
      this.selectedCharacterId = null;
      this.container = null;
    }

    init(containerId) {
      this.container = document.getElementById(containerId);
      this.render();
      this.attachEventListeners();
    }

    render() {
      // Clear container
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }

      // Create main layout
      const mainDiv = document.createElement('div');
      mainDiv.style.display = 'flex';
      mainDiv.style.gap = '20px';

      // Live Game State Panel
      mainDiv.appendChild(this.renderLiveGameState());
      // Raw Tables Panel
      mainDiv.appendChild(this.renderRawTables());

      this.container.appendChild(mainDiv);
    }

    renderLiveGameState() {
      const panel = document.createElement('div');
      panel.style.flex = '1';
      panel.style.border = '1px solid #ccc';
      panel.style.padding = '10px';

      // Header
      const header = document.createElement('h2');
      header.textContent = 'Live Game State (CRUD Tree)';
      panel.appendChild(header);

      // Buttons
      const buttonDiv = document.createElement('div');
      const loadBtn = document.createElement('button');
      loadBtn.id = 'loadBtn';
      loadBtn.textContent = 'LOAD';
      const exportBtn = document.createElement('button');
      exportBtn.id = 'exportBtn';
      exportBtn.textContent = 'Export';
      buttonDiv.append(loadBtn, exportBtn);
      panel.appendChild(buttonDiv);

      // Game and Scene Selectors
      const selectorDiv = document.createElement('div');
      selectorDiv.appendChild(this.renderGameSelector());
      selectorDiv.appendChild(document.createTextNode(' Scene: '));
      selectorDiv.appendChild(this.renderSceneSelector());
      panel.appendChild(selectorDiv);

      // Cards List
      const cardsHeader = document.createElement('h3');
      cardsHeader.textContent = 'Cards:';
      panel.appendChild(cardsHeader);
      panel.appendChild(this.renderCardList());

      const addCardBtn = document.createElement('button');
      addCardBtn.id = 'addCardBtn';
      addCardBtn.textContent = 'Add New Card';
      panel.appendChild(addCardBtn);

      // Challenges Table
      const challengesHeader = document.createElement('h3');
      challengesHeader.textContent = 'Challenges:';
      panel.appendChild(challengesHeader);
      panel.appendChild(this.renderChallengeTable());

      const addChallengeBtn = document.createElement('button');
      addChallengeBtn.id = 'addChallengeBtn';
      addChallengeBtn.textContent = 'Add New Challenge';
      panel.appendChild(addChallengeBtn);

      // Characters Table
      const charactersHeader = document.createElement('h3');
      charactersHeader.textContent = 'Characters:';
      panel.appendChild(charactersHeader);
      panel.appendChild(this.renderCharacterTable());

      const addCharacterBtn = document.createElement('button');
      addCharacterBtn.id = 'addCharacterBtn';
      addCharacterBtn.textContent = 'Add New Character';
      panel.appendChild(addCharacterBtn);

      return panel;
    }

    renderGameSelector() {
      const select = document.createElement('select');
      select.id = 'gameSelect';
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Select Game';
      select.appendChild(defaultOption);

      const games = this.scaffold.getGames();
      games.forEach(game => {
        const option = document.createElement('option');
        option.value = game.id;
        option.textContent = game.name;
        if (game.id === this.selectedGameId) option.selected = true;
        select.appendChild(option);
      });

      return select;
    }

    renderSceneSelector() {
      const select = document.createElement('select');
      select.id = 'sceneSelect';
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Select Scene';
      select.appendChild(defaultOption);

      if (this.selectedGameId) {
        const scenes = this.scaffold.getScenes(this.selectedGameId);
        scenes.forEach(scene => {
          const option = document.createElement('option');
          option.value = scene.id;
          option.textContent = scene.name;
          if (scene.id === this.selectedSceneId) option.selected = true;
          select.appendChild(option);
        });
      }

      return select;
    }

    renderCardList() {
      const ul = document.createElement('ul');
      ul.id = 'cardList';
      ul.style.listStyle = 'none';
      ul.style.padding = '0';

      if (this.selectedSceneId) {
        const cards = this.scaffold.getCards(this.selectedSceneId);
        cards.forEach(card => {
          const li = document.createElement('li');
          li.dataset.cardId = card.id;
          li.draggable = true;
          li.style.padding = '5px';
          li.style.border = '1px solid #ddd';
          li.style.margin = '2px';
          li.textContent = `${card.name} (${card.desc})`;
          ul.appendChild(li);
        });
      }

      return ul;
    }

    renderChallengeTable() {
      const table = document.createElement('table');
      table.style.border = '1px solid black';
      table.style.borderCollapse = 'collapse';

      // Header
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      ['Sel', 'ID', 'Name', 'Difficulty', 'Type', 'Edit', 'Pips'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        th.style.border = '1px solid black';
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Body
      const tbody = document.createElement('tbody');
      tbody.id = 'challengeTable';
      if (this.selectedSceneId) {
        const challenges = this.scaffold.getChallenges(this.selectedSceneId);
        if (!this.selectedChallengeId && challenges.length) {
          this.selectedChallengeId = challenges[0].id;
        }
        challenges.forEach(challenge => {
          const tr = document.createElement('tr');
          tr.dataset.id = challenge.id;
          if (challenge.id === this.selectedChallengeId) {
            tr.classList.add('selected');
            tr.style.backgroundColor = '#e0e0e0';
          }

          // Selection radio
          const tdSel = document.createElement('td');
          const radio = document.createElement('input');
          radio.type = 'radio';
          radio.name = 'challengeSelect';
          radio.value = challenge.id;
          if (challenge.id === this.selectedChallengeId) radio.checked = true;
          tdSel.appendChild(radio);
          tdSel.style.border = '1px solid black';

          // Other columns
          const columns = [
            challenge.id,
            challenge.name,
            challenge.difficulty,
            challenge.type,
            '',
            this.scaffold.getPips(challenge)
          ];
          const tds = columns.map((content, index) => {
            const td = document.createElement('td');
            if (index === 4) { // Edit button
              const btn = document.createElement('button');
              btn.className = 'editChallengeBtn';
              btn.dataset.id = challenge.id;
              btn.textContent = 'Update';
              td.appendChild(btn);
            } else {
              td.textContent = content;
            }
            td.style.border = '1px solid black';
            return td;
          });

          tr.append(tdSel, ...tds);
          tbody.appendChild(tr);
        });
      }
      table.appendChild(tbody);

      return table;
    }

    renderCharacterTable() {
      const table = document.createElement('table');
      table.style.border = '1px solid black';
      table.style.borderCollapse = 'collapse';

      // Header
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      ['Sel', 'ID', 'Name', 'Status', 'Scene ID', 'Game ID', 'Edit'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        th.style.border = '1px solid black';
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Body
      const tbody = document.createElement('tbody');
      tbody.id = 'characterTable';
      if (this.selectedSceneId) {
        const characters = this.scaffold.getCharacters(this.selectedSceneId);
        if (!this.selectedCharacterId && characters.length) {
          this.selectedCharacterId = characters[0].id;
        }
        characters.forEach(char => {
          const tr = document.createElement('tr');
          tr.dataset.id = char.id;
          if (char.id === this.selectedCharacterId) {
            tr.classList.add('selected');
            tr.style.backgroundColor = '#e0e0e0';
          }

          // Selection radio
          const tdSel = document.createElement('td');
          const radio = document.createElement('input');
          radio.type = 'radio';
          radio.name = 'characterSelect';
          radio.value = char.id;
          if (char.id === this.selectedCharacterId) radio.checked = true;
          tdSel.appendChild(radio);
          tdSel.style.border = '1px solid black';

          // Other columns
          const columns = [char.id, char.name, char.status, char.scene_id, char.game_id, ''];
          const tds = columns.map((content, index) => {
            const td = document.createElement('td');
            if (index === 5) { // Edit button
              const btn = document.createElement('button');
              btn.className = 'editCharacterBtn';
              btn.dataset.id = char.id;
              btn.textContent = 'Update';
              td.appendChild(btn);
            } else {
              td.textContent = content;
            }
            td.style.border = '1px solid black';
            return td;
          });

          tr.append(tdSel, ...tds);
          tbody.appendChild(tr);
        });
      }
      table.appendChild(tbody);

      return table;
    }

    renderRawTables() {
      const panel = document.createElement('div');
      panel.style.flex = '1';
      panel.style.border = '1px solid #ccc';
      panel.style.padding = '10px';

      const header = document.createElement('h2');
      header.textContent = 'Raw Tables (Parser/Builder)';
      panel.appendChild(header);

      const buttonDiv = document.createElement('div');
      const parseBtn = document.createElement('button');
      parseBtn.id = 'parseBtn';
      parseBtn.textContent = 'Parse';
      const buildBtn = document.createElement('button');
      buildBtn.id = 'buildBtn';
      buildBtn.textContent = 'Build';
      buttonDiv.append(parseBtn, buildBtn);
      panel.appendChild(buttonDiv);

      const textarea = document.createElement('textarea');
      textarea.id = 'rawData';
      textarea.style.width = '100%';
      textarea.style.height = '400px';
      textarea.textContent = this.scaffold.getRawData();
      panel.appendChild(textarea);

      return panel;
    }

    attachEventListeners() {
      // Game selector
      const gameSelect = document.getElementById('gameSelect');
      gameSelect.addEventListener('change', () => {
        this.selectedGameId = parseInt(gameSelect.value) || null;
        this.selectedSceneId = null;
        this.selectedChallengeId = null;
        this.selectedCharacterId = null;
        this.render();
      });

      // Scene selector
      const sceneSelect = document.getElementById('sceneSelect');
      sceneSelect.addEventListener('change', () => {
        this.selectedSceneId = parseInt(sceneSelect.value) || null;
        this.selectedChallengeId = null;
        this.selectedCharacterId = null;
        this.render();
      });

      // Parse (Load) button
      const parseBtn = document.getElementById('parseBtn');
      parseBtn.addEventListener('click', () => {
        const rawData = document.getElementById('rawData').value;
        this.scaffold.loadData(rawData);
        this.render();
      });

      // Export button
      const exportBtn = document.getElementById('exportBtn');
      exportBtn.addEventListener('click', () => {
        const data = this.scaffold.getRawData();
        alert(data); // Placeholder for export functionality
      });

      // Add buttons
      document.getElementById('addCardBtn').addEventListener('click', () => {
        if (this.selectedSceneId) {
          const name = prompt('Enter card name:');
          const desc = prompt('Enter card description:');
          const is_wild = confirm('Is this a wild card?');
          if (name && desc) {
            this.scaffold.createCard(this.selectedSceneId, { name, desc, is_wild });
            this.render();
          }
        } else {
          alert('Please select a scene.');
        }
      });

      document.getElementById('addChallengeBtn').addEventListener('click', () => {
        if (this.selectedSceneId) {
          const name = prompt('Enter challenge name:');
          const difficulty = prompt('Enter difficulty (Easy/Medium/Hard):');
          const type = prompt('Enter type (Obstacle/Character):');
          if (name && difficulty && type) {
            this.scaffold.createChallenge(this.selectedSceneId, { name, difficulty, type });
            this.render();
          }
        } else {
          alert('Please select a scene.');
        }
      });

      document.getElementById('addCharacterBtn').addEventListener('click', () => {
        if (this.selectedSceneId && this.selectedGameId) {
          const name = prompt('Enter character name:');
          const status = prompt('Enter status (Active/Idle):');
          if (name && status) {
            this.scaffold.createCharacter(this.selectedGameId, this.selectedSceneId, { name, status });
            this.render();
          }
        } else {
          alert('Please select a game and scene.');
        }
      });

      // Edit buttons (delegate to table)
      document.getElementById('challengeTable').addEventListener('click', e => {
        if (e.target.classList.contains('editChallengeBtn')) {
          const id = parseInt(e.target.dataset.id);
          const challenge = this.scaffold.getChallenge(id);
          const name = prompt('Update challenge name:', challenge.name);
          const difficulty = prompt('Update difficulty:', challenge.difficulty);
          const type = prompt('Update type:', challenge.type);
          if (name && difficulty && type) {
            this.scaffold.updateChallenge(id, { name, difficulty, type });
            this.render();
          }
        }
      });

      document.getElementById('characterTable').addEventListener('click', e => {
        if (e.target.classList.contains('editCharacterBtn')) {
          const id = parseInt(e.target.dataset.id);
          const char = this.scaffold.getCharacter(id);
          const name = prompt('Update character name:', char.name);
          const status = prompt('Update status:', char.status);
          if (name && status) {
            this.scaffold.updateCharacter(id, { name, status });
            this.render();
          }
        }
      });

      // Selection
      document.getElementById('challengeTable').addEventListener('change', e => {
        if (e.target.name === 'challengeSelect') {
          this.selectedChallengeId = parseInt(e.target.value);
          this.render();
        }
      });

      document.getElementById('characterTable').addEventListener('change', e => {
        if (e.target.name === 'characterSelect') {
          this.selectedCharacterId = parseInt(e.target.value);
          this.render();
        }
      });

      // Drag-and-drop
      const cardList = document.getElementById('cardList');
      cardList.addEventListener('dragstart', e => {
        if (e.target.tagName === 'LI') {
          e.dataTransfer.setData('text/plain', e.target.dataset.cardId);
        }
      });

      cardList.addEventListener('dragover', e => {
        e.preventDefault();
      });

      cardList.addEventListener('drop', e => {
        e.preventDefault();
        const cardId = parseInt(e.dataTransfer.getData('text/plain'));
        const targetLi = e.target.closest('li');
        if (targetLi && targetLi.dataset.cardId !== cardId) {
          const targetId = parseInt(targetLi.dataset.cardId);
          this.scaffold.reorderCards(this.selectedSceneId, cardId, targetId);
          this.render();
        }
      });
    }

    renderPips(challenge) {
      const pips = this.scaffold.getPips(challenge);
      return pips;
    }
  }

  exports.GameUI = GameUI;
});