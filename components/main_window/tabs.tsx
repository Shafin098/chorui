import React, { CSSProperties } from "react";
import Tab from "./tab";
import { TabType } from "../../main_window";

const tabsStyle: CSSProperties = {
  overflow: "scroll",
  overflowY: "hidden",
  display: "flex",
  flexDirection: "row",
};

type TabsPropType = {
  tabs: TabType[];
  changeActiveTab: (filePath: string) => void;
  closeTab: (filePath: string) => void;
};

function Tabs(props: TabsPropType) {
  const tabs = props.tabs.map((tab) => {
    return (
      <Tab
        changeActiveTab={props.changeActiveTab}
        closeTab={props.closeTab}
        key={tab.filePath}
        active={tab.active}
        filePath={tab.filePath}
      />
    );
  });

  return (
    <div id="tabs" style={tabsStyle}>
      {tabs}
    </div>
  );
}

export default Tabs;
