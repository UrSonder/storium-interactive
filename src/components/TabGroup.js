// src/components/TabGroup.js
(function(global) {
  'use strict';
  class TabGroup {
    constructor({ onTabChange }) {
      this.onTabChange = onTabChange;
      this.tabs = [
        { id: 'tree', label: '1. Live Game State (CRUD Tree)' },
        { id: 'editor', label: '2. Raw Tables (Parser/Builder)' }
      ];
      this.activeTab = 'tree';
      this.el = this.render();
    }
    render() {
      const tabGroup = document.createElement('div');
      tabGroup.className = storiumStyleRegistry.getClassName('TabGroup');
      this.tabs.forEach(tab => {
        const btn = document.createElement('button');
        btn.textContent = tab.label;
        btn.className = storiumStyleRegistry.getClassName(
          'TabButton' + (this.activeTab === tab.id ? ' TabButtonActive' : '')
        );
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
})(window);
