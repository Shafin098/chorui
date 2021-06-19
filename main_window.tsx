import path from "path";
import React, { CSSProperties, useState } from "react";
import ReactDOM from "react-dom";
import { ipcRenderer } from "electron";
import Editor from "./components/main_window/editor";
import Tabs from "./components/main_window/tabs";
import { LineType } from "./components/main_window/line";

const editorWindowStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

export type TabType = {
  fileName: string;
  active: boolean;
  lines: LineType[];
};

function EditorWindow() {
  const [tabs, setTabs] = useState<TabType[]>([
    {
      fileName: "test1",
      active: true,
      lines: [
        { text: "file1 this is a test 1", active: true, caretPosition: 0 },
        { text: "file1 this is    a test 2", active: false, caretPosition: 0 },
        { text: "file1 this is a test 3", active: false, caretPosition: 0 },
        { text: "file1 this is a test 4", active: false, caretPosition: 0 },
        { text: "file1 this is a test 5", active: false, caretPosition: 0 },
      ],
    },
    {
      fileName: "test2",
      active: false,
      lines: [
        { text: "this is    a test 1", active: true, caretPosition: 0 },
        { text: "this is a test 2", active: false, caretPosition: 0 },
        { text: "this is a test 3", active: false, caretPosition: 0 },
        { text: "this is a test 4", active: false, caretPosition: 0 },
        { text: "this is a test 5", active: false, caretPosition: 0 },
      ],
    },
  ]);

  ipcRenderer.on(
    "new-file",
    (_: any, fileContent: string, filePath: string) => {
      const lines = fileContent.split(/\r?\n/).map((line, index) => {
        if (index == 0) {
          return { text: line, active: true, caretPosition: 0 };
        } else {
          return { text: line, active: false, caretPosition: 0 };
        }
      });

      const newTab: TabType = {
        fileName: path.parse(filePath).base,
        active: true,
        lines: lines,
      };
      for (let i = 0; i < tabs.length; i++) {
        tabs[i].active = false;
      }
      tabs.push(newTab);
      setTabs([...tabs]);
    }
  );

  const updateLines = (updatedLines: LineType[], fileName: string): void => {
    let tab = tabs.filter((tab) => tab.fileName == fileName)[0];
    tab.lines = updatedLines;
    setTabs([...tabs]);
  };

  const closeTab = (filePath: string) => {
    // removing desired tab object from tab array list
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].fileName == filePath) {
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
      if (tab.fileName == filePath) {
        return { ...tab, active: true };
      } else {
        return { ...tab, active: false };
      }
    });
    setTabs([...updatedTabs]);
    //console.log(updatedTabs);
  };

  const activeTab = tabs.filter((tab) => tab.active)[0];
  if (activeTab == undefined) {
    return <div>Open a file by pressing Ctrl+O</div>;
  } else {
    return (
      <div style={editorWindowStyle}>
        <Tabs
          tabs={tabs}
          changeActiveTab={changeActiveTab}
          closeTab={closeTab}
        />
        <Editor
          lines={activeTab.lines}
          activeFileName={activeTab.fileName}
          updateLines={updateLines}
        />
      </div>
    );
  }
}

ReactDOM.render(<EditorWindow />, document.getElementById("root"));
