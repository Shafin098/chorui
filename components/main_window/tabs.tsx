import React, { CSSProperties } from "react";
import Tab from "./tab";
import { TabType } from "../../main_window";

const tabsStyle: CSSProperties = {
  overflowX: "scroll",
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
        key={tab.fileName}
        active={tab.active}
        fileName={tab.fileName}
      />
    );
  });

  return <div style={tabsStyle}>{tabs}</div>;
}

export default Tabs;
