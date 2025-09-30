// src/AppLoader.js
// Modular AppLoader using CssFactory and scaffolding, robust error handling
(function(global) {
  'use strict';
  try {
    class AppLoader {
      constructor(rootId = 'app-root') {
        try {
          this.root = document.getElementById(rootId);
          if (!this.root) throw new Error('AppLoader: root element not found');
        } catch (e) {
          alert('AppLoader failed to find root: ' + (e && e.message ? e.message : e));
          if (window && window.console) console.error(e);
          throw e;
        }
        try {
          this.cssFactory = new window.CssFactory();
          this.dh = this.cssFactory.getDomHandler();
        } catch (e) {
          alert('AppLoader failed to initialize CssFactory: ' + (e && e.message ? e.message : e));
          if (window && window.console) console.error(e);
          throw e;
        }
        try {
          this.scaffolding = new window.GameUIScaffolding(window.gameDataAPI); // expects gameDataAPI global
        } catch (e) {
          alert('AppLoader failed to initialize GameUIScaffolding: ' + (e && e.message ? e.message : e));
          if (window && window.console) console.error(e);
          throw e;
        }
        try {
          this.selectionState = new window.GameUIXSelectionState();
        } catch (e) {
          alert('AppLoader failed to initialize GameUIXSelectionState: ' + (e && e.message ? e.message : e));
          if (window && window.console) console.error(e);
          throw e;
        }
        try {
          this.init();
        } catch (e) {
          alert('AppLoader failed during init: ' + (e && e.message ? e.message : e));
          if (window && window.console) console.error(e);
          throw e;
        }
      }
      init() {
        try {
          // Clear root
          while (this.root.firstChild) this.root.removeChild(this.root.firstChild);
        } catch (e) {
          alert('AppLoader failed to clear root: ' + (e && e.message ? e.message : e));
          if (window && window.console) console.error(e);
        }
        try {
          // TabGroup
          this.tabGroup = new window.TabGroup({
            onTabChange: this.switchTab.bind(this),
            cssFactory: this.cssFactory
          });
          this.root.appendChild(this.tabGroup.getElement());
        } catch (e) {
          alert('AppLoader failed to initialize TabGroup: ' + (e && e.message ? e.message : e));
          if (window && window.console) console.error(e);
        }
        try {
          // Content container
          this.contentContainer = this.dh.createElement('div', [this.cssFactory.getClass('container')]);
          this.root.appendChild(this.contentContainer);
        } catch (e) {
          alert('AppLoader failed to create content container: ' + (e && e.message ? e.message : e));
          if (window && window.console) console.error(e);
        }
        try {
          // EditorGroup
          this.editorGroup = new window.EditorGroup({
            onParse: () => {},
            onBuild: () => {},
            initialText: 'Sample text here...',
            cssFactory: this.cssFactory
          });
        } catch (e) {
          alert('AppLoader failed to initialize EditorGroup: ' + (e && e.message ? e.message : e));
          if (window && window.console) console.error(e);
        }
        try {
          // TreeviewGroup (uses scaffolding)
          this.treeviewGroup = new window.TreeviewGroup({
            getDb: () => window.gameDataAPI,
            onCrud: () => {},
            getSelection: () => null,
            setSelection: () => {},
            cssFactory: this.cssFactory
          });
        } catch (e) {
          alert('AppLoader failed to initialize TreeviewGroup: ' + (e && e.message ? e.message : e));
          if (window && window.console) console.error(e);
        }
        // EnhancedTreeviewGroup removed
        try {
          // Start on tree tab
          this.switchTab('tree');
        } catch (e) {
          alert('AppLoader failed to switch to initial tab: ' + (e && e.message ? e.message : e));
          if (window && window.console) console.error(e);
        }
      }
      switchTab(tabId) {
        try {
          this.contentContainer.innerHTML = '';
          if (tabId === 'tree') {
            this.contentContainer.appendChild(this.treeviewGroup.getElement());
          } else if (tabId === 'editor') {
            this.contentContainer.appendChild(this.editorGroup.getElement());
          }
        } catch (e) {
          alert('AppLoader failed to switch tab: ' + (e && e.message ? e.message : e));
          if (window && window.console) console.error(e);
        }
      }
    }
    global.AppLoader = AppLoader;
  } catch (e) {
    alert('AppLoader failed: ' + (e && e.message ? e.message : e));
    if (window && window.console) console.error(e);
  }
})(window);
