// demo-loader.js
(function(global) {
  'use strict';
  class DemoApp {
    constructor() {
      this.root = document.getElementById('app-root');
      if (!this.root) {
        document.body.innerHTML = '<div style="color:red;font-size:2em;">Error: Root element not found. App cannot start.</div>';
        return;
      }
      if (!global._storiumAttempt) global._storiumAttempt = 1;
      else global._storiumAttempt++;
      this.root.innerHTML = '<div style="font-size:1.2em;color:#888;">attempt #' + global._storiumAttempt + '</div>';
      // Show Hello World
      const hello = document.createElement('div');
      hello.style.fontSize = '2em';
      hello.style.color = '#222';
      hello.style.marginTop = '1em';
      hello.textContent = 'Hello World (DemoApp)';
      this.root.appendChild(hello);
    }
  }
  global.DemoApp = DemoApp;
  if (typeof window !== 'undefined' && window.document) {
    global.demoApp = new DemoApp();
  }
})(typeof window !== 'undefined' ? window : this);
