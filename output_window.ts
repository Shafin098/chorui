import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import { remote } from "electron";

const outputArea = document.querySelector(".output-area");
const stopBtn = document.querySelector("#stop-btn");

const pakhiSrcPath: string = remote.getCurrentWindow().title;
let pakhiProcess = spawn("/usr/local/bin/pakhi", [pakhiSrcPath]);

addCtrlCStop(pakhiProcess);

function addCtrlCStop(pakhiProc: ChildProcessWithoutNullStreams): void {
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "c") {
      pakhiProc.kill();
    }
  });
}

stopBtn?.addEventListener("click", () => {
  pakhiProcess.kill();
});

pakhiProcess.stdout.on("data", (data) => {
  let preElem = makePre(data.toString());
  if (outputArea === null) {
    console.error("Cannot find outputArea");
  } else {
    let lastChild = outputArea.querySelector(".input-area");
    if (lastChild === null) {
      console.error("input-area dom element not found");
    } else {
      outputArea.removeChild(lastChild);
      outputArea.appendChild(preElem);
      outputArea.appendChild(createInputArea());
    }
  }
});

pakhiProcess.stderr.on("data", (errData) => {
  let errPreElem = makeErrorPre(errData.toString());
  if (outputArea === null) {
    console.error("Cannot find outputArea");
  } else {
    let lastChild = outputArea.querySelector(".input-area");
    if (lastChild === null) {
      console.error("input-area dom element not found");
    } else {
      outputArea.removeChild(lastChild);
      outputArea.appendChild(errPreElem);
      outputArea.appendChild(createInputArea());
    }
  }
});

document.addEventListener("keypress", (ev) => {
  let newline = "\n";
  if (process.platform === "win32") {
    newline = "\r\n";
  }
  let inputArea = document.querySelector(".input-area");
  if (ev.target === inputArea && ev.key === "Enter") {
    if (inputArea !== null) {
      pakhiProcess.stdin.write(inputArea.textContent + newline);
      pakhiProcess.stdin.end();
    } else {
      console.error("input area is null");
    }
  }
});

function makeErrorPre(err: string): HTMLPreElement {
  let pre = document.createElement("pre");
  pre.innerHTML = err;
  pre.style.color = "red";
  return pre;
}

function makePre(err: string): HTMLPreElement {
  let pre = document.createElement("pre");
  pre.innerHTML = err;
  return pre;
}

function createInputArea(): HTMLPreElement {
  let inputPre = document.createElement("pre");
  inputPre.contentEditable = "true";
  inputPre.classList.add("input-area");
  return inputPre;
}
