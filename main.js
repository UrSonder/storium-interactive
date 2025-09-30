// main.js
// Entry point for Storium Game State Interactive WebApp


(function() {
  'use strict';
  try {
    if (!window.StyleRegistry || !window.RelationalDb || !window.GameAPI) {
      if (window.errorCollector) window.errorCollector.report(new Error('Essential libraries are missing.'), 'main.js');
      else console.error('Essential libraries are missing.');
      return;
    }
  } catch (e) {
    if (window.errorCollector) window.errorCollector.report(e, 'main.js');
    else console.error(e);
    return;
  }
})();

  // StyleRegistry is initialized in style-groups.js and attached to window.storiumStyleRegistry

  if (!window.storiumStyleRegistry) {
    if (window.errorCollector) window.errorCollector.report(new Error('StyleRegistry not initialized.'), 'main.js');
    else throw new Error('StyleRegistry not initialized.');
    return;
  }

  // DOM root

  const root = document.getElementById('app-root');
  if (!root) {
    if (window.errorCollector) window.errorCollector.report(new Error('Root element not found. App cannot start.'), 'main.js');
    // Remove all children from body
    while (document.body.firstChild) document.body.removeChild(document.body.firstChild);
    const cssFactory = new window.CssFactory();
    const dh = cssFactory.getDomHandler();
    const errorDiv = dh.createElement('div', [cssFactory.getClass('error')], {}, {innerText:'Error: Root element not found. App cannot start.'});
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
    const cssFactory = new window.CssFactory();
    const dh = cssFactory.getDomHandler();
    const contentContainer = dh.createElement('div', [cssFactory.getClass('container')]);
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
    if (window.errorCollector) window.errorCollector.report(e, 'main.js');
    root.innerHTML = '';
    const cssFactory = new window.CssFactory();
    const dh = cssFactory.getDomHandler();
    const errorDiv = dh.createElement('div', [cssFactory.getClass('error')], {}, {innerText:'App failed to load: ' + (e.message || e)});
    root.appendChild(errorDiv);
  }
