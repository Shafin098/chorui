import React from "react";
import Tab from "./tab";

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

export default Tabs;
