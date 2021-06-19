const path = require("path");
const { app, BrowserWindow } = require("electron");
const fs = require("fs");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile("index.html");
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
