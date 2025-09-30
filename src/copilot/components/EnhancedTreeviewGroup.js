// src/components/EnhancedTreeviewGroup.js
// Uses css-management for all styling, robust error handling
(function(global) {
  'use strict';
  try {
    class EnhancedTreeviewGroup {
      constructor({ scaffolding, selectionState, cssFactory }) {
        if (!scaffolding || !selectionState || !cssFactory) throw new Error('EnhancedTreeviewGroup: missing dependency');
        this.scaffold = scaffolding;
        this.selection = selectionState;
        this.css = cssFactory;
        this.dh = cssFactory.getDomHandler();
        this.el = this.render();
      }
      render() {
        // Use CssFactory for all class names
  const get = name => this.css.getClass('EnhancedTreeview-' + name);
  const group = this.dh.createElement('div', [get('container')]);
        // Challenge table
  const challengeTable = this.dh.createElement('table', [get('table')]);
  const thead = this.dh.createElement('thead', []);
  const headRow = this.dh.createElement('tr', [get('header')]);
        ['Sel','id','name','difficulty','type','[Edit]','Pips'].forEach(h=>{
          headRow.appendChild(this.dh.createElement('th', [get('header')], {}, {scope:'col',innerText:h}));
        });
        thead.appendChild(headRow);
        challengeTable.appendChild(thead);
  const tbody = this.dh.createElement('tbody', []);
        // Get data
        const sceneId = '3'; // For demo, should be dynamic
        const challenges = this.scaffold.getChallengesWithPips(sceneId);
        challenges.forEach((ch, idx) => {
          const row = this.dh.createElement('tr', [get('row'), this.selection.getSelectedChallenge() === ch.challenge.data[0] ? get('selRow') : '']);
          // Sel arrow
          row.appendChild(this.dh.createElement('td', [get('arrow')], {}, {innerText: this.selection.getSelectedChallenge() === ch.challenge.data[0] ? '>' : ''}));
          // Data columns
          ch.challenge.data.forEach(val => row.appendChild(this.dh.createElement('td', [], {}, {innerText: val}))); 
          // Edit button
          row.appendChild(this.dh.createElement('td', [get('editBtn')], {}, {innerText:'[Edit]'}));
          // Pips
          const pipTd = this.dh.createElement('td', []);
          const played = this.scaffold.getCardsPlayedOnChallenge(ch.challenge.data[0]);
          for(let i=0;i<ch.pips;i++){
            let pipType = get('pipEmpty');
            if (played[i]) {
              pipType = i%2 ? get('pipStrong') : get('pipWeak');
            }
            pipTd.appendChild(this.dh.createElement('span', [get('pip'), pipType], {}, {innerText: played[i] ? (pipType===get('pipStrong')?'[X]':'[x]') : '[ ]'}));
          }
          row.appendChild(pipTd);
          // Row click handler for selection
          row.onclick = () => {
            this.selection.setSelectedChallenge(ch.challenge.data[0]);
            this.update();
          };
          tbody.appendChild(row);
        });
        challengeTable.appendChild(tbody);
        group.appendChild(challengeTable);
        return group;
      }
      update() {
        // Re-render for selection changes
        const parent = this.el.parentNode;
        if (parent) {
          parent.replaceChild(this.render(), this.el);
        }
      }
      getElement() {
        return this.el;
      }
    }
    global.EnhancedTreeviewGroup = EnhancedTreeviewGroup;
  } catch (e) {
    alert('EnhancedTreeviewGroup failed: ' + (e && e.message ? e.message : e));
    if (window && window.console) console.error(e);
  }
})(window);
