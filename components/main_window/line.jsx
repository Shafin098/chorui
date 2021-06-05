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
      //console.log(lineDivRef.current.childNodes)
      if (lineDivRef.current.childNodes.length > 0) {
        console.log(
          "dbg: ",
          lineDivRef.current.childNodes,
          props.caretPosition
        );
        const range = document.createRange();
        range.setStart(lineDivRef.current.childNodes[0], props.caretPosition);
        range.collapse(true);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  });

  const escapeHtml = (htmlString) => {
    htmlString = htmlString.replaceAll("<", "&lt;");
    htmlString = htmlString.replaceAll(">", "&gt;");
    return htmlString;
  };

  return (
    <div style={lineStyle}>
      <div style={lineNumberStyle}>{props.lineIndex + 1}</div>
      <pre
        style={{ minWidth: "10%" }}
        ref={lineDivRef}
        dangerouslySetInnerHTML={{ __html: escapeHtml(props.txt) }}
        contentEditable={true}
        onClick={(e) => props.handleOnClick(props.lineIndex)}
        onInput={(e) => {
          //console.log("calling change");
          props.handleChange(e.target.innerText, props);
        }}
        onKeyDown={(e) => props.handleKeyPress(e, props.lineIndex)}
      ></pre>
    </div>
  );
}

export default Line;
