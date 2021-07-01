const { app, BrowserWindow, dialog, Menu, ipcMain } = require("electron");
const fs = require("fs");

ipcMain.on("open-output", (e, srcPath) => {
  openOutPutWindow(srcPath);
});

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadFile("index.html");

  const menu = Menu.buildFromTemplate([
    {
      label: "File",
      submenu: [
        {
          label: "Open",
          accelerator: "CommandOrControl+O",
          click: () => openFileDialog(win),
        },
        {
          label: "Save",
          accelerator: "CommandOrControl+S",
          click: () => emitSaveFileEvent(win),
        },
      ],
    },
  ]);
  win.setMenu(menu);
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  // macOS specific behaviour
  // can be removed because not going to support macOS
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  // windows and linux users expect to close app when all windows are closed
  if (process.platform !== "darwin") {
    app.quit();
  }
});

let outputWin = null;

function openOutPutWindow(srcPath) {
  const editorWin = BrowserWindow.getFocusedWindow();
  if (editorWin === null) {
    console.log("Unexpected error: mainWin is null");
    app.quit();
    return;
  }

  let { x, y } = editorWin.getBounds();
  outputWin = new BrowserWindow({
    x: x + 10,
    y: y + 10,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  outputWin.loadFile("output.html");
  // documents title will be used as src file path for pakhi spawned process
  outputWin.title = srcPath;
  outputWin.once("ready-to-show", () => {
    if (outputWin === null) {
      console.log("Unexpected error: ouputWin is null");
      app.quit();
    } else {
      outputWin.show();
    }
  });
  outputWin.on("closed", () => {
    outputWin = null;
  });
}

function openFileDialog(browserWin) {
  let openedFiles = dialog.showOpenDialogSync(browserWin, {
    properties: ["openFile"],
  });
  const filePath = openedFiles[0];
  const fileContent = fs.readFileSync(filePath, { encoding: "utf8" });
  browserWin.webContents.send("new-file", fileContent, filePath);
}

// Sends save-file event to renderer process
function emitSaveFileEvent(browserWin) {
  browserWin.webContents.send("save-file");
}
