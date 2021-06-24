const { app, BrowserWindow, dialog, Menu } = require("electron");
const fs = require("fs");

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
