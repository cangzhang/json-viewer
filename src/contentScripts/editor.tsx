import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker&inline';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker&inline';
/*
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
*/

import JsonWorker from './worker?worker&inline';

(self as any).MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === 'json') {
      return new jsonWorker();
    }
    /*
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    */
    return new editorWorker();
  },
};

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
  pre.style.display = 'none';

  const worker = new JsonWorker();
  const sendMsg = exchangeMsg(worker);
  const data: any = await sendMsg(pre.innerText);
  const editor = monaco.editor.create(root, {
    value: data.msg,
    language: 'json',
    readOnly: true,
    maxTokenizationLineLength: 1024,
  });

  return editor;
}
