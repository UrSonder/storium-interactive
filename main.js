// main.js
// Entry point for Storium Game State Interactive WebApp

(function() {
  'use strict';

  // Ensure libraries are loaded
  if (!window.StyleRegistry || !window.RelationalDb || !window.GameAPI) {
    console.error('Essential libraries are missing.');
    return;
  }
})();

  // StyleRegistry is initialized in style-groups.js and attached to window.storiumStyleRegistry
  if (!window.storiumStyleRegistry) {
    throw new Error('StyleRegistry not initialized.');
  }

  // DOM root
  const root = document.getElementById('app-root');
  if (!root) {
    // Remove all children from body
    while (document.body.firstChild) document.body.removeChild(document.body.firstChild);
    const errorDiv = document.createElement('div');
    errorDiv.style.color = 'red';
    errorDiv.style.fontSize = '2em';
    errorDiv.textContent = 'Error: Root element not found. App cannot start.';
    document.body.appendChild(errorDiv);
    return;
  }

  // Minimal modular app loader: two tabs (Treeview, Editor)
  try {
    // Clear root
    while (root.firstChild) root.removeChild(root.firstChild);

    // TabGroup
    const tabGroup = new window.TabGroup({
      onTabChange: switchTab
    });
    root.appendChild(tabGroup.getElement());

    // Content container
    const contentContainer = document.createElement('div');
    contentContainer.style.marginTop = '2em';
    root.appendChild(contentContainer);

    // EditorGroup
    const editorGroup = new window.EditorGroup({
      onParse: () => {},
      onBuild: () => {},
      initialText: 'Sample text here...'
    });

    // TreeviewGroup
    const treeviewGroup = new window.TreeviewGroup({
      getDb: () => null,
      onCrud: () => {},
      getSelection: () => null,
      setSelection: () => {}
    });

    function switchTab(tabId) {
      contentContainer.innerHTML = '';
      if (tabId === 'tree') {
        contentContainer.appendChild(treeviewGroup.getElement());
      } else if (tabId === 'editor') {
        contentContainer.appendChild(editorGroup.getElement());
      }
    }

    // Start on tree tab
    switchTab('tree');

  } catch (e) {
    root.innerHTML = '';
    const errorDiv = document.createElement('div');
    errorDiv.style.color = 'red';
    errorDiv.style.fontSize = '1.5em';
    errorDiv.textContent = 'App failed to load: ' + (e.message || e);
    root.appendChild(errorDiv);
  }
