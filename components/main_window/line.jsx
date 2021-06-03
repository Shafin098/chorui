import React, { useEffect, useRef } from "react";

const lineStyle = {
  width: "100%",
  fontFamily: "monospace",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  whiteSpace: "nowrap",
};

const lineNumberStyle = {
  background: "#eee",
  color: "rgb(50, 50, 255)",
  padding: "0.2em",
  marginRight: "0.4rem",
};

function Line(props) {
  const lineDivRef = useRef();

  useEffect(() => {
    if (props.active) {
      //console.log(props.txt.length, props.caretPosition);
      lineDivRef.current.focus();
      // setting caret position properly
      const range = document.createRange();
      //console.log(lineDivRef.current.childNodes)
      range.setStart(lineDivRef.current.childNodes[0], props.caretPosition);
      range.collapse(true);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });

  return (
    <div style={lineStyle}>
      <div style={lineNumberStyle}>{props.lineIndex + 1}</div>
      <div
        style={{ minWidth: "10%" }}
        ref={lineDivRef}
        dangerouslySetInnerHTML={{ __html: props.txt }}
        contentEditable={true}
        onClick={(e) => props.handleOnClick(props.lineIndex)}
        onInput={(e) => {
          console.log("calling change");
          props.handleChange(e.target.innerText, props);
        }}
        onKeyDown={(e) => props.handleKeyPress(e, props.lineIndex)}
      ></div>
    </div>
  );
}

export default Line;
