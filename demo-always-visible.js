// demo-always-visible.js
// This script guarantees visible output, no dependencies, no IIFE, no checks.
(function() {
  var root = document.getElementById('app-root');
  if (!root) {
    var fallback = document.createElement('div');
    fallback.style.color = 'red';
    fallback.style.fontSize = '2em';
    fallback.textContent = 'Error: Root element not found. App cannot start.';
    document.body.appendChild(fallback);
    return;
  }
  while (root.firstChild) root.removeChild(root.firstChild);
  var attemptDiv = document.createElement('div');
  attemptDiv.style.fontSize = '1.2em';
  attemptDiv.style.color = '#888';
  attemptDiv.textContent = 'attempt #' + (window._demoAttempt = (window._demoAttempt || 0) + 1);
  root.appendChild(attemptDiv);
  var hello = document.createElement('div');
  hello.style.fontSize = '2em';
  hello.style.color = '#222';
  hello.style.marginTop = '1em';
  hello.textContent = 'Hello World (DEMO-ALWAYS-VISIBLE)';
  root.appendChild(hello);
})();
