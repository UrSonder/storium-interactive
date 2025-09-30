// src/components/EditorGroup.js
(function(global) {
  'use strict';
  class EditorGroup {
    constructor({ onParse, onBuild, initialText }) {
      this.onParse = onParse;
      this.onBuild = onBuild;
      this.el = this.render(initialText);
    }
    render(initialText) {
      const group = document.createElement('div');
      group.className = storiumStyleRegistry.getClassName('EditorGroup');

      // Button group
      const btnGroup = document.createElement('div');
      btnGroup.className = storiumStyleRegistry.getClassName('ButtonGroup');

      const parseBtn = document.createElement('button');
      parseBtn.textContent = 'Parse (Text → Tree)';
      parseBtn.className = storiumStyleRegistry.getClassName('ActionButton');
      parseBtn.onclick = () => this.onParse(this.textarea.value);
      btnGroup.appendChild(parseBtn);

      const buildBtn = document.createElement('button');
      buildBtn.textContent = 'Build (Tree → Text)';
      buildBtn.className = storiumStyleRegistry.getClassName('ActionButton ActionButtonSecondary');
      buildBtn.onclick = () => this.onBuild();
      btnGroup.appendChild(buildBtn);

      group.appendChild(btnGroup);

      // Textarea
      this.textarea = document.createElement('textarea');
      this.textarea.className = storiumStyleRegistry.getClassName('Textarea');
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
})(window);
