/*
  style-groups.js
  Define and register all group-based CSS using StyleRegistry as per css-management/README.md
*/

(function(global) {
  'use strict';
  if (!global.StyleRegistry) {
    throw new Error('StyleRegistry not loaded');
  }
  const styleRegistry = new global.StyleRegistry('storium');

  // Example group styles (expand as needed)
  styleRegistry.registerGroup('TabGroup', {
    display: 'flex',
    gap: '8px',
    borderBottom: '2px solid #10b981',
    marginBottom: '16px',
  });
  styleRegistry.registerGroup('TabButton', {
    padding: '12px 24px',
    border: 'none',
    background: 'none',
    color: '#059669',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s',
  });
  styleRegistry.registerGroup('TabButtonActive', {
    borderBottom: '2px solid #10b981',
    color: '#10b981',
  });
  styleRegistry.registerGroup('TabContent', {
    borderTop: '2px solid #10b981',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(16,185,129,0.08)',
    padding: '32px',
    minHeight: '60vh',
  });
  styleRegistry.registerGroup('TreeviewGroup', {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
  });
  styleRegistry.registerGroup('EditorGroup', {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '16px',
  });
  styleRegistry.registerGroup('ButtonGroup', {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
  });
  styleRegistry.registerGroup('ActionButton', {
    padding: '8px 20px',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '1rem',
    background: '#10b981',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s',
  });
  styleRegistry.registerGroup('ActionButtonSecondary', {
    background: '#6366f1',
  });
  styleRegistry.registerGroup('Textarea', {
    width: '100%',
    minHeight: '300px',
    fontFamily: 'monospace',
    fontSize: '1rem',
    padding: '16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    background: '#f3f4f6',
    color: '#111827',
  });
  // ...add more group styles as needed

  global.storiumStyleRegistry = styleRegistry;
})(window);
