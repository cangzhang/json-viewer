/* eslint-disable no-console */
// import { onMessage } from 'webext-bridge';

import { initEditor } from './editor';
import './style.css';

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(async () => {
  console.info('[json-viewer] Hello world from content script');

  // communication example: send previous tab title from background page
  // onMessage('tab-prev', ({ data }) => {
  //   console.log(`[json-viewer] Navigate from page "${data.title}"`);
  // });

  // mount component to context window
  // const container = document.createElement('div');
  // const root = document.createElement('div');
  // root.id = 'app';
  // const styleEl = document.createElement('link');
  // const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container;
  // styleEl.setAttribute('rel', 'stylesheet');
  // styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'));
  // shadowDOM.appendChild(styleEl);
  // shadowDOM.appendChild(root);
  // document.body.appendChild(container);

  const pre = document.createElement('pre');
  pre.id = 'json_viewer_editor_container';

  const editor = await initEditor(pre);
  window.addEventListener(`resize`, () => {
    editor.resize();
  });
})();
