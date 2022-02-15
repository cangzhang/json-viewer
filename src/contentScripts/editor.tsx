// https://github.com/securingsincity/react-ace/issues/725#issuecomment-543109155
import 'ace-builds/src-min-noconflict/ace';
import 'ace-builds/src-min-noconflict/mode-json';
import 'ace-builds/src-noconflict/ext-searchbox';
import jsonWorkerUrl from 'ace-builds/src-noconflict/worker-json?url';

import JsonWorker from './worker?worker&inline';

// @ts-ignore
window.ace.config.setModuleUrl('ace/mode/json_worker', jsonWorkerUrl);

const shouldReplace = (): [boolean, HTMLPreElement] => {
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
  const [isJson, pre] = shouldReplace();
  if (!isJson) {
    return;
  }

  document.body.style.margin = `0`;
  // pre.style.display = 'none';

  const worker = new JsonWorker();
  const sendMsg = exchangeMsg(worker);
  const data: any = await sendMsg(pre.innerText);
  console.log(data);
  // @ts-ignore
  const editor = window.ace.edit(pre);
  editor.setOptions({
    mode: 'ace/mode/json',
    readOnly: true,
    maxLines: Infinity,
  });
  editor.setValue(data.msg);

  return editor;
}
