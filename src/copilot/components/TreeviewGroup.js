// src/components/TreeviewGroup.js

// Robust error handling wrapper
(function(global) {
  'use strict';
  try {
    class TreeviewGroup {
      constructor({ getDb, onCrud, getSelection, setSelection, cssFactory }) {
        this.getDb = getDb;
        this.onCrud = onCrud;
        this.getSelection = getSelection;
        this.setSelection = setSelection;
        this.css = cssFactory;
        this.dh = cssFactory.getDomHandler();
        this.el = this.render();
      }
      render() {
  const get = name => this.css.getClass('Treeview-' + name);
  const group = this.dh.createElement('div', [get('container')]);
  this.dropdownContainer = this.dh.createElement('div', [get('dropdown')]);
        group.appendChild(this.dropdownContainer);
  this.container = this.dh.createElement('div', [get('container')]);
        group.appendChild(this.container);
        return group;
      }
      updateTree() {
        // Clear previous
        while (this.dropdownContainer.firstChild) this.dropdownContainer.removeChild(this.dropdownContainer.firstChild);
        while (this.container.firstChild) this.container.removeChild(this.container.firstChild);
        const db = this.getDb();
        if (!db) {
          this.container.appendChild(this.dh.createElement('div', [this.css.getClass('error')], {}, {innerText:'No data loaded.'}));
          return;
        }
        // Game dropdown
        const games = db.tables.getTable('tblGames');
        if (!games) {
          this.container.appendChild(this.dh.createElement('div', [this.css.getClass('error')], {}, {innerText:'No games found.'}));
          return;
        }
        const gameSelect = this.dh.createElement('select', [this.css.getClass('dropdown')]);
        games.rows.data.forEach(gameRow => {
          const opt = this.dh.createElement('option', [], {}, {value:gameRow.data[0],innerText:gameRow.data[1]});
          gameSelect.appendChild(opt);
        });
        gameSelect.value = this.getSelection('game') || games.rows.data[0]?.data[0] || '';
        gameSelect.onchange = () => {
          this.setSelection('game', gameSelect.value);
          this.setSelection('scene', null);
          this.updateTree();
        };
        this.dropdownContainer.appendChild(this.dh.createElement('span', [this.css.getClass('label')], {}, {innerText:'Game: '}));
        this.dropdownContainer.appendChild(gameSelect);

        // Scene dropdown
        const scenes = db.tables.getTable('tblScenes');
        let sceneSelect = null;
        let selectedGameId = gameSelect.value;
        if (scenes) {
          sceneSelect = this.dh.createElement('select', [this.css.getClass('dropdown')]);
          const filteredScenes = scenes.rows.data.filter(sceneRow => String(sceneRow.data[6]) === String(selectedGameId));
          filteredScenes.forEach(sceneRow => {
            const opt = this.dh.createElement('option', [], {}, {value:sceneRow.data[0],innerText:sceneRow.data[1]});
            sceneSelect.appendChild(opt);
          });
          sceneSelect.value = this.getSelection('scene') || filteredScenes[0]?.data[0] || '';
          sceneSelect.onchange = () => {
            this.setSelection('scene', sceneSelect.value);
            this.updateTree();
          };
    this.dropdownContainer.appendChild(this.dh.createElement('span', [get('label')], {}, {innerText:'  Scene: '}));
          this.dropdownContainer.appendChild(sceneSelect);
        }

        // Show editable challenges and characters for selected scene
        const selectedSceneId = sceneSelect ? sceneSelect.value : null;
        if (selectedSceneId) {
          // Challenges
          const challenges = db.tables.getTable('tblChallenges');
          if (challenges) {
            const chHeader = this.dh.createElement('h4', [get('label')], {}, {innerText:'Challenges'});
            this.container.appendChild(chHeader);
            challenges.rows.data.filter(row => String(row.data[1]) === String(selectedSceneId)).forEach(row => {
              this.container.appendChild(this.makeEditableRow('challenge', row));
            });
            // Add new challenge
            this.container.appendChild(this.makeAddRow('challenge', selectedSceneId));
          }
          // Characters
          const chars = db.tables.getTable('tblCharacters');
          if (chars) {
            const cHeader = this.dh.createElement('h4', [get('label')], {}, {innerText:'Characters'});
            this.container.appendChild(cHeader);
            chars.rows.data.filter(row => String(row.data[3]) === String(selectedSceneId)).forEach(row => {
              this.container.appendChild(this.makeEditableRow('character', row));
            });
            // Add new character
            this.container.appendChild(this.makeAddRow('character', selectedSceneId));
          }
        }
      }

      makeEditableRow(entityType, row) {
  const form = this.dh.createElement('form', [get('form')]);
        form.onsubmit = e => { e.preventDefault(); this.emitCrud('update', entityType, row.data[0], this.getFormData(form)); };
        // Render all fields as text inputs except id and scene_id/game_id
        row.data.forEach((val, idx) => {
          const input = this.dh.createElement('input', [get('input')], {}, {type:'text',value:val,size:8});
          if (idx === 0) input.readOnly = true; // id
          if (entityType === 'challenge' && idx === 1) input.readOnly = true; // scene_id
          if (entityType === 'character' && idx === 3) input.readOnly = true; // scene_id
          input.onchange = () => { input.value = input.value; };
          form.appendChild(input);
        });
        // Update button
  const updateBtn = this.dh.createElement('button', [get('button')], {}, {type:'submit',innerText:'Update'});
        form.appendChild(updateBtn);
        // Delete button
  const delBtn = this.dh.createElement('button', [get('button')], {}, {type:'button',innerText:'Delete'});
        delBtn.onclick = () => this.emitCrud('delete', entityType, row.data[0]);
        form.appendChild(delBtn);
        return form;
      }

      makeAddRow(entityType, sceneId) {
  const form = this.dh.createElement('form', [get('form')]);
        form.onsubmit = e => { e.preventDefault(); this.emitCrud('create', entityType, null, this.getFormData(form, true, sceneId)); };
        // For add, render empty fields except scene_id
        let numFields = entityType === 'challenge' ? 5 : 5; // id, scene_id, ...
        for (let i = 0; i < numFields; ++i) {
          const input = this.dh.createElement('input', [get('input')], {}, {type:'text',size:8});
          if (i === 0) { input.value = 'auto'; input.readOnly = true; }
          else if ((entityType === 'challenge' && i === 1) || (entityType === 'character' && i === 3)) {
            input.value = sceneId;
            input.readOnly = true;
          }
          form.appendChild(input);
        }
  const addBtn = this.dh.createElement('button', [get('button')], {}, {type:'submit',innerText:'Add'});
        form.appendChild(addBtn);
        return form;
      }

      getFormData(form, isAdd = false, sceneId = null) {
        const data = [];
        for (let i = 0; i < form.elements.length; ++i) {
          const el = form.elements[i];
          if (el.tagName === 'INPUT') {
            if (isAdd && el.readOnly && sceneId && el.value === sceneId) data.push(sceneId);
            else if (isAdd && el.readOnly && el.value === 'auto') data.push(null);
            else data.push(el.value);
          }
        }
        return data;
      }

      emitCrud(action, entityType, id, data) {
        if (typeof this.onCrud === 'function') {
          this.onCrud(action, { entityType, id, data });
        }
      }
      getElement() {
        return this.el;
      }
    }
    global.TreeviewGroup = TreeviewGroup;
  } catch (e) {
    alert('TreeviewGroup failed: ' + (e && e.message ? e.message : e));
    const root = document.getElementById('app-root');
    if (root) {
      root.innerHTML = '<div style="color:red;font-size:1.5em;">TreeviewGroup failed: ' + (e && e.message ? e.message : e) + '</div>';
    }
  }
})(window);
