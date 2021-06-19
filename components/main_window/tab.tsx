import React, { CSSProperties } from "react";

type TabPropType = {
  fileName: string;
  active: boolean;
  changeActiveTab: (filePath: string) => void;
  closeTab: (filePath: string) => void;
};

function Tab(props: TabPropType) {
  const tabStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-around",
    alignItems: "center",
    background: "#eee",
    padding: "0.5rem",
    border: "1px solid #333",
  };

  if (!props.active) {
    tabStyle.background = "#fff";
  }

  return (
    <div style={tabStyle}>
      <div onClick={() => props.changeActiveTab(props.fileName)}>
        {props.fileName}
      </div>
      <div
        onClick={() => props.closeTab(props.fileName)}
        style={{
          width: "0.5rem",
          height: "0.5rem",
          border: "1px solid #333",
          borderRadius: "50%",
          background: "red",
          padding: "0px",
          marginLeft: "10px",
        }}
      ></div>
    </div>
  );
}

export default Tab;
