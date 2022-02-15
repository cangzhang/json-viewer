// https://github.com/securingsincity/react-ace/issues/725#issuecomment-543109155
import 'ace-builds/src-min-noconflict/ace';
import 'ace-builds/src-min-noconflict/mode-json';
import 'ace-builds/src-noconflict/ext-searchbox';
import jsonWorkerUrl from 'ace-builds/src-noconflict/worker-json?url';

import JsonWorker from './worker?worker&inline';

// @ts-ignore
window.ace.config.setModuleUrl('ace/mode/json_worker', jsonWorkerUrl);

const getJsonElm = (): [boolean, HTMLPreElement] => {
  const pre = document.body.children[0] as HTMLPreElement;
  let json = pre?.innerText ?? ``;
  let isJson: boolean;
  try {
    JSON.parse(json);
    isJson = true;
  } catch (e) {
    isJson = false;
  }

  return [isJson, pre];
};

const exchangeMsg = (worker: Worker) => (msg: any) => new Promise((resolve, reject) => {
  worker.postMessage({ msg });
  worker.onmessage = (e: MessageEvent) => {
    const { data } = e;
    if (data.error) {
      reject(data.error);
    } else {
      resolve(data);
    }
  };
});

export async function initEditor() {
  const [isJson, pre] = getJsonElm();
  if (!isJson) {
    return;
  }

  const root = document.createElement('pre');
  root.id = 'json_viewer_editor_container';

  try {
    document.body.style.margin = `0`;

    root.style.height = '100vh';
    root.style.margin = `unset`;

    let val = ``;
    try {
      const worker = new JsonWorker();
      const sendMsg = exchangeMsg(worker);
      const data: any = await sendMsg(pre.innerText);
      val = data.msg;
    } catch (err) {
      val = JSON.stringify(JSON.parse(pre.innerText), null, 2);
    }
    // const val = JSON.stringify(JSON.parse(pre.innerText), null, 2);

    // @ts-ignore
    const editor = window.ace.edit(root);
    editor.setOptions({
      mode: 'ace/mode/json',
      readOnly: true,
    });
    editor.setValue(val, -1);

    pre.style.display = 'none';
    document.body.appendChild(root);

    return editor;
  } catch (e) {
    console.error(e);
    pre.style.display = 'block';
    root.parentNode?.removeChild(root);
    return Promise.reject(e);
  }
}
