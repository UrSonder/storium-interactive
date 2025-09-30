// src/components/EditorGroup.js

// Robust error handling wrapper
(function(global) {
  'use strict';
  try {
    class EditorGroup {
      constructor({ onParse, onBuild, initialText, cssFactory }) {
        this.onParse = onParse;
        this.onBuild = onBuild;
        this.css = cssFactory;
        this.dh = cssFactory.getDomHandler();
        this.el = this.render(initialText);
      }
      render(initialText) {
        const get = name => this.css.getClass(name);
        const group = this.dh.createElement('div', [get('container')]);
        // Button group
        const btnGroup = this.dh.createElement('div', [get('form')]);
        const parseBtn = this.dh.createElement('button', [get('button')], {}, {innerText:'Parse (Text → Tree)'});
        parseBtn.onclick = () => this.onParse(this.textarea.value);
        btnGroup.appendChild(parseBtn);
        const buildBtn = this.dh.createElement('button', [get('button')], {}, {innerText:'Build (Tree → Text)'});
        buildBtn.onclick = () => this.onBuild();
        btnGroup.appendChild(buildBtn);
        group.appendChild(btnGroup);
        // Textarea
        this.textarea = this.dh.createElement('textarea', [get('textarea')]);
        this.textarea.value = initialText || '';
        group.appendChild(this.textarea);
        return group;
      }
      getElement() {
        return this.el;
      }
      setText(text) {
        this.textarea.value = text;
      }
      getText() {
        return this.textarea.value;
      }
    }
    global.EditorGroup = EditorGroup;
  } catch (e) {
    alert('EditorGroup failed: ' + (e && e.message ? e.message : e));
    const root = document.getElementById('app-root');
    if (root) {
      root.innerHTML = '<div style="color:red;font-size:1.5em;">EditorGroup failed: ' + (e && e.message ? e.message : e) + '</div>';
    }
  }
})(window);
