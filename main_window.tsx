import fs from "fs";
import React, { CSSProperties, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ipcRenderer } from "electron";
import Editor from "./components/main_window/editor";
import Tabs from "./components/main_window/tabs";
import { LineType } from "./components/main_window/line";
import { color } from "./components/main_window/util/color";

const editorWindowStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

const welcomeScreenStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  backgroundColor: color.bg,
  color: color.fg,
  fontFamily: "monospace",
  fontSize: "1.2rem",
  fontWeight: "bold",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

export type TabType = {
  filePath: string;
  active: boolean;
  lines: LineType[];
};

function EditorWindow() {
  const [tabs, setTabs] = useState<TabType[]>([]);

  useEffect(() => {
    registerNewFileOpenListener(tabs, setTabs);
    registerFileSavedListener(tabs);
    registerFileCreatedListener(tabs, setTabs);

    // removing all listeners
    return unregisterAllListeners;
  }, [tabs]);

  const updateLines = (updatedLines: LineType[], fileName: string): void => {
    let tab = tabs.filter((tab) => tab.filePath == fileName)[0];
    tab.lines = updatedLines;
    setTabs([...tabs]);
  };

  const closeTab = (filePath: string) => {
    // removing desired tab object from tab array list
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].filePath == filePath) {
        tabs.splice(i, 1);
        break;
      }
    }
    // setting first tab as active tab
    if (tabs.length > 0) {
      tabs[0].active = true;
    }
    setTabs([...tabs]);
  };

  const changeActiveTab = (filePath: string) => {
    const updatedTabs = tabs.map((tab) => {
      if (tab.filePath == filePath) {
        return { ...tab, active: true };
      } else {
        return { ...tab, active: false };
      }
    });
    setTabs([...updatedTabs]);
  };

  const sendActiveFilePath = () => {
    for (let tab of tabs) {
      if (tab.active) {
        ipcRenderer.send("open-output", tab.filePath);
        break;
      }
    }
  };

  const activeTab = tabs.filter((tab) => tab.active)[0];
  if (activeTab == undefined) {
    return (
      <div style={welcomeScreenStyle}>
        <p>
          Open a file by pressing{" "}
          <code style={{ color: color.gray }}>Ctrl+O</code>
        </p>
        <p>
          Or create a new file by pressing{" "}
          <code style={{ color: color.gray }}>Ctrl+N</code>
        </p>
      </div>
    );
  } else {
    return (
      <div style={editorWindowStyle}>
        <Tabs
          tabs={tabs}
          changeActiveTab={changeActiveTab}
          closeTab={closeTab}
          runCallback={sendActiveFilePath}
        />
        <Editor
          lines={activeTab.lines}
          activeFileName={activeTab.filePath}
          updateLines={updateLines}
        />
      </div>
    );
  }
}

ReactDOM.render(<EditorWindow />, document.getElementById("root"));

function registerNewFileOpenListener(
  tabs: TabType[],
  setTabs: (tabs: TabType[]) => void
): void {
  // when main process opens a new file "new-file" event is sent
  ipcRenderer.on(
    "open-file",
    (_: any, fileContent: string, filePath: string) => {
      // converting file content to Tab object
      const lines = fileContent.split(/\r?\n/).map((line, index) => {
        // Tabs causes problems with caret positon, so replacing tab with 4 spaces
        line = line.replaceAll(/\t/g, "    ");
        // cursor should be on first line, so making first line active
        if (index == 0) {
          return {
            text: line,
            active: true,
            caretPosition: 0,
            selectionStart: -1,
            selectionEnd: -1,
          };
        } else {
          return {
            text: line,
            active: false,
            caretPosition: 0,
            selectionStart: -1,
            selectionEnd: -1,
          };
        }
      });
      // creating new tab to insert into tabs array
      const newTab: TabType = {
        filePath: filePath,
        active: true,
        lines: lines,
      };
      // deactivating other tabs, because new tab is active
      for (let i = 0; i < tabs.length; i++) {
        tabs[i].active = false;
      }

      if (fileContent == "" && filePath == "") {
        newTab.filePath = "*unnamed";
      }

      tabs.push(newTab);
      setTabs([...tabs]);
    }
  );
}

function registerFileCreatedListener(
  tabs: TabType[],
  setTabs: React.Dispatch<React.SetStateAction<TabType[]>>
) {
  ipcRenderer.on("new-file-created", (_, filePath: string) => {
    for (let tab of tabs) {
      if (tab.active === true && tab.filePath === "*unnamed") {
        tab.filePath = filePath;
        setTabs([...tabs]);
        break;
      }
    }
  });
}

function registerFileSavedListener(tabs: TabType[]): void {
  ipcRenderer.on("save-file", () => {
    let concatedLines = "";

    for (let tab of tabs) {
      if (tab.active == true) {
        for (let line of tab.lines) {
          if (concatedLines == "") {
            concatedLines = line.text;
          } else {
            concatedLines += "\n" + line.text;
          }
        }

        if (tab.filePath == "*unnamed") {
          ipcRenderer.send(
            "open-save-as",
            tab.lines.map((l) => l.text).join("\n")
          );
        } else {
          fs.writeFileSync(tab.filePath, concatedLines);
        }

        break;
      }
    }
  });
}

function unregisterAllListeners() {
  ipcRenderer.removeAllListeners("open-file");
  ipcRenderer.removeAllListeners("save-file");
  ipcRenderer.removeAllListeners("new-file-created");
}
