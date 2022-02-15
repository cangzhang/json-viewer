self.onmessage = (ev) => {
  const text = ev.data.msg;
  const json = JSON.stringify(JSON.parse(text), null, 2);
  postMessage({ msg: json });
};
