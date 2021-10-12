import path from "path";
import React, { CSSProperties } from "react";
import { color } from "./util/color";

type TabPropType = {
  filePath: string;
  active: boolean;
  changeActiveTab: (filePath: string) => void;
  closeTab: (filePath: string) => void;
  runCallback: () => void;
};

function Tab(props: TabPropType) {
  const tabStyle: CSSProperties = {
    color: color.fg,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-around",
    alignItems: "center",
    background: color.bg,
    padding: "0.5rem",
    border: "1px solid #333",
  };

  let showRunBtn = "block";
  if (!props.active) {
    tabStyle.background = color.bg1;
    showRunBtn = "none";
  }

  return (
    <div style={tabStyle}>
      <button
        onClick={props.runCallback}
        style={{
          display: showRunBtn,
          cursor: "pointer",
          background: color.bg,
          padding: "0px",
          marginRight: "10px",
          width: "0",
          height: "0",
          borderTop: "0.5rem solid transparent",
          borderBottom: "0.5rem solid transparent",
          borderLeft: "0.5rem solid green",
        }}
      ></button>
      <div onClick={() => props.changeActiveTab(props.filePath)}>
        {path.parse(props.filePath).base}
      </div>
      <div
        onClick={() => props.closeTab(props.filePath)}
        style={{
          cursor: "pointer",
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
