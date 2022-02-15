// https://github.com/securingsincity/react-ace/issues/725#issuecomment-543109155
import 'ace-builds/src-min-noconflict/ace';
import 'ace-builds/src-min-noconflict/mode-json';
import 'ace-builds/src-noconflict/ext-searchbox';
import jsonWorkerUrl from 'ace-builds/src-noconflict/worker-json?url';

import JsonWorker from './worker?worker&inline';

// @ts-ignore
window.ace.config.setModuleUrl('ace/mode/json_worker', jsonWorkerUrl);

const getPreElm = (): [boolean, HTMLPreElement] => {
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

export async function initEditor(root: HTMLElement) {
  const [isJson, pre] = getPreElm();
  if (!isJson) {
    return;
  }

  document.body.style.margin = `0`;
  pre.style.display = 'none';

  document.body.appendChild(root);
  root.style.height = '100vh';
  root.style.margin = `unset`;

  const worker = new JsonWorker();
  const sendMsg = exchangeMsg(worker);
  const { msg: val }: any = await sendMsg(pre.innerText);
  // const val = JSON.stringify(JSON.parse(pre.innerText), null, 2);

  // @ts-ignore
  const editor = window.ace.edit(root);
  editor.setOptions({
    mode: 'ace/mode/json',
    readOnly: true,
  });
  editor.setValue(val, -1);

  return editor;
}
