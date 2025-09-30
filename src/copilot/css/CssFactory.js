
// src/css/CssFactory.js
// Minimal robust CssFactory replacement
(function(global) {
  'use strict';
  try {
    class CssFactory {
      constructor() {
        // No dependencies, just a stub for getClass
      }
      getClass(name) {
        // Return the class name directly for now
        return name;
      }
      getDomHandler() {
        // Return a minimal dom handler
        return {
          createElement: function(tag, classNames, styles, attrs) {
            const el = document.createElement(tag);
            if (Array.isArray(classNames)) el.className = classNames.join(' ');
            else if (typeof classNames === 'string') el.className = classNames;
            if (styles && typeof styles === 'object') {
              for (const k in styles) el.style[k] = styles[k];
            }
            if (attrs && typeof attrs === 'object') {
              for (const k in attrs) el[k] = attrs[k];
            }
            return el;
          },
          injectStylesheet: function() {},
        };
      }
      getStyleRegistry() {
        return null;
      }
    }
    global.CssFactory = CssFactory;
  } catch (e) {
    alert('CssFactory failed: ' + (e && e.message ? e.message : e));
    if (window && window.console) console.error(e);
  }
})(window);
