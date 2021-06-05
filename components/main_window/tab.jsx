import React from "react";

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

export default Tab;
