import React, { createRef, CSSProperties, useEffect } from "react";

export type LineType = { text: string; active: boolean; caretPosition: number };

const lineStyle: CSSProperties = {
  width: "100%",
  fontFamily: "monospace",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  whiteSpace: "nowrap",
};

const lineNumberStyle: CSSProperties = {
  background: "#eee",
  color: "rgb(50, 50, 255)",
  padding: "0.2em",
  marginRight: "0.4rem",
};

export type LinePropType = {
  txt: string;
  active: boolean;
  caretPosition: number;
  lineIndex: number;
  padding: number;
  handleOnClick: (lineIndex: number) => void;
  handleChange: (text: string, props: LinePropType) => void;
  handleKeyPress: (
    e: React.KeyboardEvent<HTMLPreElement>,
    lineIndex: number
  ) => void;
};

function Line(props: LinePropType) {
  const lineDivRef = createRef<HTMLPreElement>();

  useEffect(() => {
    if (props.active) {
      if (lineDivRef.current !== null) {
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
          console.log("end debug");

          const range = document.createRange();
          console.log(lineDivRef.current.childNodes);

          range.setStart(lineDivRef.current.childNodes[0], props.caretPosition);
          range.collapse(true);
          const selection = window.getSelection();
          if (selection !== null) {
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      }
    }
  });

  const escapeHtml = (htmlString: string) => {
    htmlString = htmlString.replaceAll("<", "&lt;");
    htmlString = htmlString.replaceAll(">", "&gt;");
    return htmlString;
  };

  const lineNumber = (props.lineIndex + 1).toString();
  let pads = "";
  for (let i = 0; i < props.padding; i++) {
    pads += " ";
  }
  return (
    <div style={lineStyle}>
      <pre style={lineNumberStyle}>{`${pads}${lineNumber}`}</pre>
      <pre
        style={{ minWidth: "10%" }}
        ref={lineDivRef}
        dangerouslySetInnerHTML={{ __html: escapeHtml(props.txt) }}
        contentEditable={true}
        onClick={(_) => props.handleOnClick(props.lineIndex)}
        onInput={(e) => {
          //console.log("calling change");
          const preElem = e.target as HTMLPreElement;
          props.handleChange(preElem.innerText, props);
        }}
        onKeyDown={(e) => props.handleKeyPress(e, props.lineIndex)}
      ></pre>
    </div>
  );
}

export default Line;
