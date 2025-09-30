// src/components/EditorGroup.js

// Robust error handling wrapper
(function(global) {
  'use strict';
  try {
    class EditorGroup {
      constructor({ onParse, onBuild, initialText }) {
        this.onParse = onParse;
        this.onBuild = onBuild;
        this.el = this.render(initialText);
      }
      render(initialText) {
        const group = document.createElement('div');
    const styleRegistry = window.storiumStyleRegistry;
    group.className = styleRegistry ? styleRegistry.getClassName('EditorGroup') : '';

        // Button group
        const btnGroup = document.createElement('div');
    btnGroup.className = styleRegistry ? styleRegistry.getClassName('ButtonGroup') : '';

        const parseBtn = document.createElement('button');
        parseBtn.textContent = 'Parse (Text → Tree)';
    parseBtn.className = styleRegistry ? styleRegistry.getClassName('ActionButton') : '';
        parseBtn.onclick = () => this.onParse(this.textarea.value);
        btnGroup.appendChild(parseBtn);

        const buildBtn = document.createElement('button');
        buildBtn.textContent = 'Build (Tree → Text)';
    buildBtn.className = styleRegistry ? styleRegistry.getClassName('ActionButton ActionButtonSecondary') : '';
        buildBtn.onclick = () => this.onBuild();
        btnGroup.appendChild(buildBtn);

        group.appendChild(btnGroup);

        // Textarea
        this.textarea = document.createElement('textarea');
    this.textarea.className = styleRegistry ? styleRegistry.getClassName('Textarea') : '';
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
