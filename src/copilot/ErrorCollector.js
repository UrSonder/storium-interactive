// src/ErrorCollector.js
// Collects and displays up to 10 errors, then halts app with a modal
(function(global) {
  'use strict';
  class ErrorCollector {
    constructor(maxErrors = 10) {
      this.errors = [];
      this.maxErrors = maxErrors;
      this.fatal = false;
    }
    report(err, context) {
      if (this.fatal) return;
      const msg = (context ? `[${context}] ` : '') + (err && err.message ? err.message : String(err));
      this.errors.push(msg);
      if (window.console) console.error('AppError:', msg);
      if (this.errors.length >= this.maxErrors) {
        this.fatal = true;
        this.showFatalModal();
      } else {
        this.showErrorBanner(msg);
      }
    }
    showErrorBanner(msg) {
      let banner = document.getElementById('error-banner');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'error-banner';
        banner.style.position = 'fixed';
        banner.style.top = '0';
        banner.style.left = '0';
        banner.style.width = '100vw';
        banner.style.background = '#fee2e2';
        banner.style.color = '#b91c1c';
        banner.style.padding = '0.5em 2em';
        banner.style.zIndex = '99998';
        banner.style.fontWeight = 'bold';
        banner.style.fontSize = '1em';
        document.body.appendChild(banner);
      }
      banner.innerText = 'App error: ' + msg;
    }
    showFatalModal() {
      var modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100vw';
      modal.style.height = '100vh';
      modal.style.background = 'rgba(0,0,0,0.85)';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.zIndex = '99999';
      var box = document.createElement('div');
      box.style.background = '#fff';
      box.style.color = '#b91c1c';
      box.style.padding = '2em 3em';
      box.style.borderRadius = '12px';
      box.style.boxShadow = '0 4px 32px #0008';
      box.style.maxWidth = '90vw';
      box.style.fontSize = '1.2em';
      box.innerHTML = '<b>Critical Error</b><br><br>Too many errors encountered. App halted.' +
        '<br><br><pre style="font-size:0.9em;max-height:30vh;overflow:auto;">' + this.errors.map(e => e.replace(/</g,'&lt;')).join('\n') + '</pre>';
      modal.appendChild(box);
      document.body.appendChild(modal);
    }
  }
  global.ErrorCollector = ErrorCollector;
  global.errorCollector = new ErrorCollector();
})(window);
