// src/components/TabGroup.js

// Robust error handling wrapper
(function(global) {
  'use strict';
  try {
    class TabGroup {
      constructor({ onTabChange, cssFactory }) {
        this.onTabChange = onTabChange;
        this.css = cssFactory;
        this.dh = cssFactory.getDomHandler();
        this.tabs = [
          { id: 'tree', label: '1. Live Game State (CRUD Tree)' },
          { id: 'editor', label: '2. Raw Tables (Parser/Builder)' }
        ];
        this.activeTab = 'tree';
        this.el = this.render();
      }
      render() {
        const get = name => this.css.getClass(name);
        const tabGroup = this.dh.createElement('div', [get('tab')]);
        this.tabs.forEach(tab => {
          const btn = this.dh.createElement('button', [get(this.activeTab === tab.id ? 'tabActive' : 'tab')], {}, {innerText: tab.label});
          btn.onclick = () => this.setActiveTab(tab.id);
          tabGroup.appendChild(btn);
        });
        return tabGroup;
      }
      setActiveTab(tabId) {
        if (this.activeTab === tabId) return;
        this.activeTab = tabId;
        if (typeof this.onTabChange === 'function') {
          this.onTabChange(tabId);
        }
      }
      getElement() {
        return this.el;
      }
    }
    global.TabGroup = TabGroup;
  } catch (e) {
    alert('TabGroup failed: ' + (e && e.message ? e.message : e));
    const root = document.getElementById('app-root');
    if (root) {
      root.innerHTML = '<div style="color:red;font-size:1.5em;">TabGroup failed: ' + (e && e.message ? e.message : e) + '</div>';
    }
  }
})(window);
