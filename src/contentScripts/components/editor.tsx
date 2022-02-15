// https://github.com/securingsincity/react-ace/issues/725#issuecomment-543109155
import 'ace-builds/src-min-noconflict/ace';
import 'ace-builds/src-min-noconflict/mode-json';
import 'ace-builds/src-noconflict/ext-searchbox';
import jsonWorkerUrl from 'ace-builds/src-noconflict/worker-json?url';

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

ace.config.setModuleUrl('ace/mode/json_worker', jsonWorkerUrl);

export function App() {
  const [, setIsJson] = React.useState(false);

  useEffect(() => {
    const pre = document.body.children[0] as HTMLPreElement;
    const json = pre?.innerText ?? ``;
    let isJson = false;

    try {
      JSON.parse(json);
      isJson = true;
    } catch (e) {
      isJson = false;
    }

    setIsJson(isJson);

    if (isJson) {
      const editor = ace.edit(pre);
      editor.setOptions({
        mode: 'ace/mode/json',
        readOnly: true,
      });
      editor.setOptions({
        maxLines: Infinity,
      });
    }
  }, []);

  return (
    <></>
  );
}

export function init(root: HTMLElement) {
  ReactDOM.render(<App/>, root);
}
