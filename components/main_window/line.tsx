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
    if (props.active && lineDivRef.current !== null) {
      lineDivRef.current.focus();
      if (lineDivRef.current.childNodes.length > 0) {
        // Setting caret properly using props.caretPosition.
        // Line component can have textnode inside span elem or only textnode.
        // props.caretPosition is offset from the start of the line, but
        // caret only be set only in textnode and takes local offset.
        // So traversing line componensts all child nodes and calculating local caret offset
        const range = document.createRange();
        let adjustedCaretPosition = props.caretPosition;
        for (let child of Array.from(lineDivRef.current.childNodes)) {
          if (child.nodeName == "SPAN") {
            let c = child as HTMLElement;
            if (adjustedCaretPosition > c.innerText.length) {
              let c = child as HTMLElement;
              adjustedCaretPosition -= c.innerText.length;
            } else {
              if (child.firstChild != null) {
                range.setStart(child.firstChild, adjustedCaretPosition);
              }
              range.collapse(true);
              const selection = window.getSelection();
              if (selection !== null) {
                selection.removeAllRanges();
                selection.addRange(range);
              }

              break;
            }
          } else {
            if (
              child.textContent != null &&
              adjustedCaretPosition > child.textContent.length
            ) {
              if (child.textContent !== null) {
                adjustedCaretPosition -= child.textContent.length;
              }
            } else {
              range.setStart(child, adjustedCaretPosition);
              range.collapse(true);
              const selection = window.getSelection();
              if (selection !== null) {
                selection.removeAllRanges();
                selection.addRange(range);
              }

              break;
            }
          }
        }
      }
    }
  });

  const highLight = (htmlString: string): string => {
    return htmlString
      .replace(/<span.*?#.*?#.*?<\/span>|(#.*?#)/gu, (match, group1) => {
        if (group1 === undefined) {
          return match;
        } else {
          return `<span style='color:grey;'>${group1}</span>`;
        }
      })
      .replace(/<span.*?".*?".*?<\/span>|(".*?")/gu, (match, group1) => {
        if (group1 === undefined) {
          return match;
        } else {
          return `<span style='color:green;'>${group1}</span>`;
        }
      })
      .replace(/<span.*?ফাং.*?<\/span>|(ফাং)/gu, (m, group1) => {
        if (group1 === undefined) {
          return m.replace(
            /(<\/span>.*?)ফাং(.*?<span)/gu,
            (newM, newGoup1, newGroup2): string => {
              if (newM) {
                return `${newGoup1}<span style='color:red;'></span>${newGroup2}`;
              } else {
                return newM;
              }
            }
          );
        } else {
          return `<span style='color:red;'>${group1}</span>`;
        }
      }).replace(/<span.*?নাম.*?<\/span>|(নাম)/gu, (m, group1) => {
        if (group1 === undefined) {
          return m.replace(
            /(<\/span>.*?)নাম(.*?<span)/gu,
            (newM, newGoup1, newGroup2): string => {
              if (newM) {
                return `${newGoup1}<span style='color:blue;'></span>${newGroup2}`;
              } else {
                return newM;
              }
            }
          );
        } else {
          return `<span style='color:blue;'>${group1}</span>`;
        }
      }).replace(/<span.*?[,;(){}\[\]=].*?<\/span>|([,;(){}\[\]=])/gu, (m, group1) => {
        if (group1 === undefined) {
          return m.replace(
            /(<\/span>.*?)[,;(){}\[\]=](.*?<span)/gu,
            (newM, newGoup1, newGroup2): string => {
              if (newM) {
                return `${newGoup1}<span style='color:purple;'></span>${newGroup2}`;
              } else {
                return newM;
              }
            }
          );
        } else {
          return `<span style='color:purple;'>${group1}</span>`;
        }
      });
  };

  const escapeHtml = (htmlString: string): string => {
    htmlString = htmlString.replace(/</g, "&lt;");
    htmlString = htmlString.replace(/>/g, "&gt;");
    return highLight(htmlString);
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
          const preElem = e.target as HTMLPreElement;
          props.handleChange(preElem.innerText, props);
        }}
        onKeyDown={(e) => props.handleKeyPress(e, props.lineIndex)}
      ></pre>
    </div>
  );
}

export default Line;
