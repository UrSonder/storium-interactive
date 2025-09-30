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
          { id: 'tree', label: 'Tab 1' },
          { id: 'editor', label: 'Tab 2' }
        ];
        this.activeTab = 'tree';
        this.el = this.render();
      }
      render() {
  const get = name => this.css.getClass('TabGroup-' + name);
        // Main container for tabs and content
  const wrapper = this.dh.createElement('div', [get('tabGroup')]);
  // Tab buttons
  this.tabBtnRow = this.dh.createElement('div', [get('tabGroup')]);
        this.tabs.forEach(tab => {
          const btnClass = this.activeTab === tab.id ? get('tabButtonActive') : get('tabButton');
          const btn = this.dh.createElement('button', [btnClass], {}, {innerText: tab.label});
          btn.style.flex = '1 1 0';
          btn.style.width = '95%';
          btn.onclick = () => this.setActiveTab(tab.id);
          this.tabBtnRow.appendChild(btn);
        });
        wrapper.appendChild(this.tabBtnRow);
        // Content area
  this.contentArea = this.dh.createElement('div', [get('container')]);
        wrapper.appendChild(this.contentArea);
        this.updateContent();
        return wrapper;
      }
      setActiveTab(tabId) {
        if (this.activeTab === tabId) return;
        this.activeTab = tabId;
        // Update tab button classes
        Array.from(this.tabBtnRow.children).forEach((btn, idx) => {
          const tab = this.tabs[idx];
          btn.className = this.activeTab === tab.id ? get('tabButtonActive') : get('tabButton');
        });
        this.updateContent();
        if (typeof this.onTabChange === 'function') {
          this.onTabChange(tabId);
        }
      }
      updateContent() {
        // Clear content area
        while (this.contentArea.firstChild) this.contentArea.removeChild(this.contentArea.firstChild);
        if (this.activeTab === 'tree') {
          // Tab 1: Just a label for demo
          const label = this.dh.createElement('div', [get('label')], {}, {innerText: 'Tab 1 content'});
          this.contentArea.appendChild(label);
        } else if (this.activeTab === 'editor') {
          // Tab 2: Textarea
          const textarea = this.dh.createElement('textarea', [get('textarea')]);
          textarea.value = 'Tab 2 textarea';
          this.contentArea.appendChild(textarea);
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
