// src/components/TabGroup.js

// Robust error handling wrapper
(function(global) {
  'use strict';
  try {
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
    const styleRegistry = window.storiumStyleRegistry;
    tabGroup.className = styleRegistry ? styleRegistry.getClassName('TabGroup') : '';
        this.tabs.forEach(tab => {
          const btn = document.createElement('button');
          btn.textContent = tab.label;
          btn.className = styleRegistry ? styleRegistry.getClassName(
            'TabButton' + (this.activeTab === tab.id ? ' TabButtonActive' : '')
          ) : '';
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
