import React, { useState } from "react";
import ReactDOM from "react-dom";
import Editor from "./components/main_window/editor";

function Tab(props) {
  const tabStyle = {
    background: "#eee",
    padding: "0.5rem",
    border: "1px solid #333",
  };

  if (!props.active) {
    tabStyle.background = "#fff";
  }

  return (
    <div onClick={() => props.changeActiveTab(props.fileName)} style={tabStyle}>
      {props.fileName}
    </div>
  );
}

const tabsStyle = {
  overflowX: "scroll",
  display: "flex",
  flexDirection: "row",
};

function Tabs(props) {
  const tabs = props.tabs.map((tab) => {
    return (
      <Tab
        changeActiveTab={props.changeActiveTab}
        key={tab.fileName}
        active={tab.active}
        fileName={tab.fileName}
      />
    );
  });

  return <div style={tabsStyle}>{tabs}</div>;
}

const editorWindowStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

function EditorWindow(props) {
  const [tabs, setTabs] = useState([
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

  const updateLines = (updatedLines, fileName) => {
    let tab = tabs.filter((tab) => tab.fileName == fileName)[0];
    tab.lines = updatedLines;
    setTabs([...tabs]);
  };

  const changeActiveTab = (fileName) => {
    const updatedTabs = tabs.map((tab) => {
      if (tab.fileName == fileName) {
        return { ...tab, active: true };
      } else {
        return { ...tab, active: false };
      }
    });
    console.log("tab clicked");
    setTabs([...updatedTabs]);
    console.log(updatedTabs);
  };

  const activeTab = tabs.filter((tab) => tab.active)[0];

  return (
    <div style={editorWindowStyle}>
      <Tabs tabs={tabs} changeActiveTab={changeActiveTab} />
      <Editor
        lines={activeTab.lines}
        activeFileName={activeTab.fileName}
        updateLines={updateLines}
      />
    </div>
  );
}

ReactDOM.render(<EditorWindow />, document.getElementById("root"));
