// src/css/CssFactory.js
// App-specific CSS factory using css-management, robust error handling
(function(global) {
  'use strict';
  try {
    class CssFactory {
      constructor(appPrefix = 'storium') {
        this.sr = new window.StyleRegistry(appPrefix);
        this.dh = new window.DomHandler();
        this._registerAll();
        this.dh.injectStylesheet(this.sr);
      }
      _registerAll() {
        // Register all app CSS classes here
        const cssProps = 'border-collapse;border;background-color;color;font-weight;padding;margin;text-align;font-size;display;gap;flex-direction;align-items;justify-content;width;height;box-shadow;outline;cursor';
        const cssNames = [
          'table','selRow','pip','pipEmpty','pipWeak','pipStrong','header','editBtn','arrow','row',
          'container','dropdown','button','error','tab','tabActive','textarea','form','input','label'
        ];
        const cssValues = [
          '#ccc,1px solid #888,#fff,#222,normal,2px,4px,left,1em,null,null,null,null,null,null,null,null,null,null', // table
          '#eee,2px solid #007bff,#e6f0ff,#007bff,bold,2px,4px,left,1em,null,null,null,null,null,null,null,null,null,null', // selRow
          'transparent,none,#fff,#222,normal,1px,1px,center,1em,null,null,null,null,null,null,null,null,null,null', // pip
          'transparent,1px solid #bbb,#fff,#bbb,normal,1px,1px,center,1em,null,null,null,null,null,null,null,null,null,null', // pipEmpty
          '#f8d7da,1px solid #d9534f,#fff,#d9534f,bold,1px,1px,center,1em,null,null,null,null,null,null,null,null,null,null', // pipWeak
          '#d4edda,1px solid #28a745,#fff,#28a745,bold,1px,1px,center,1em,null,null,null,null,null,null,null,null,null,null', // pipStrong
          '#222,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null', // header
          '#fff,1px solid #007bff,#007bff,#fff,bold,2px,4px,center,1em,null,null,null,null,null,null,null,null,null,null', // editBtn
          'transparent,none,#fff,#007bff,bold,1px,1px,center,1em,null,null,null,null,null,null,null,null,null,null', // arrow
          '#fff,1px solid #ccc,#fff,#222,normal,2px,4px,left,1em,null,null,null,null,null,null,null,null,null,null', // row
          // Extra UI elements
          'null,null,#f9f9f9,#222,normal,8px,16px,null,1.1em,flex,8px,column,flex-start,flex-start,100%,auto,null,null,null,null', // container
          'null,1px solid #bbb,#fff,#222,normal,2px,4px,left,1em,block,null,null,null,null,null,null,null,null,null', // dropdown
          '#007bff,1px solid #007bff,#fff,#fff,bold,2px,8px,center,1em,inline-block,null,null,null,null,null,null,null,pointer', // button
          '#fff,2px solid #f00,#fff,#f00,bold,8px,16px,center,1.2em,block,null,null,null,null,null,null,null,null,null', // error
          '#f5f5f5,1px solid #ccc,#f5f5f5,#222,bold,2px,8px,center,1em,inline-block,null,null,null,null,null,null,null,null,null', // tab
          '#e6f0ff,2px solid #007bff,#e6f0ff,#007bff,bold,2px,8px,center,1em,inline-block,null,null,null,null,null,null,null,null,null', // tabActive
          '#fff,1px solid #bbb,#fff,#222,normal,4px,8px,left,1em,block,null,null,null,null,null,null,null,null', // textarea
          'null,null,null,null,normal,8px,16px,null,1em,flex,8px,row,center,center,auto,auto,null,null,null', // form
          '#fff,1px solid #bbb,#fff,#222,normal,2px,4px,left,1em,inline-block,null,null,null,null,null,null,null,null,null', // input
          'null,null,null,#222,bold,2px,4px,left,1em,inline-block,null,null,null,null,null,null,null,null,null' // label
        ];
        this.classMap = this.sr.registerStyles('app', cssProps, cssNames, cssValues);
      }
      getClass(name) {
        const idx = this.sr.registeredClasses ? Array.from(this.sr.registeredClasses).indexOf(this.sr.app_prefix+'-app-'+name) : -1;
        return this.classMap[idx] || '';
      }
      getDomHandler() {
        return this.dh;
      }
      getStyleRegistry() {
        return this.sr;
      }
    }
    global.CssFactory = CssFactory;
  } catch (e) {
    alert('CssFactory failed: ' + (e && e.message ? e.message : e));
    if (window && window.console) console.error(e);
  }
})(window);
