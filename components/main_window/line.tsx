import React, {
  createRef,
  CSSProperties,
  MutableRefObject,
  useEffect,
  useMemo,
} from "react";
import { color } from "./util/color";

export type LineType = {
  text: string;
  active: boolean;
  caretPosition: number;
  selectionStart: number;
  selectionEnd: number;
};

let lineStyle: CSSProperties = {
  width: "100%",
  background: color.bg,
  color: color.fg,
  fontFamily: "monospace",
  fontSize: "1rem",
  display: "flex",
  flexDirection: "row",
  alignItems: "scenter",
  whiteSpace: "nowrap",
};

const lineNumberStyle: CSSProperties = {
  background: color.bg,
  color: color.gray,
  paddingLeft: "0.5rem",
  paddingRight: "1rem",
};

export type LinePropType = {
  txt: string;
  active: boolean;
  caretPosition: number;
  lineIndex: number;
  padding: number;
  insideCommentBlock: MutableRefObject<boolean>;
  mouseDown: MutableRefObject<boolean>;
  selectionStart: number;
  selectionEnd: number;
  handleOnClick: (lineIndex: number) => void;
  handleChange: (text: string, props: LinePropType) => void;
  handleKeyPress: (
    e: React.KeyboardEvent<HTMLPreElement>,
    lineIndex: number
  ) => void;
  handleOnBlur: (
    lineIndex: number,
    selectionStart: number,
    selectionEnd: number
  ) => void;
  handleMouseOver: (lineIndex: number) => void;
  previousLineInSelection: (lineIndex: number) => boolean;
};

function Line(props: LinePropType) {
  //console.log(props.lineIndex, "rendering line");

  const highLightCommentAndString = (htmlString: string): string => {
    let highlightedString = "";
    let pointer = 0;

    if (props.insideCommentBlock.current) {
      const closingHashPos = htmlString.indexOf("#");
      if (closingHashPos == -1) {
        // whole line must be comment
        return `<span style='color:${color.gray};'>` + htmlString + "</span>";
      } else {
        // line contains closing #
        highlightedString +=
          `<span style='color:${color.gray};'>` +
          htmlString.substring(0, closingHashPos + 1) +
          "</span>";
        pointer = closingHashPos + 1;
        props.insideCommentBlock.current = false;
      }
    }
    while (pointer < htmlString.length) {
      if (pointer >= props.selectionStart && pointer < props.selectionEnd) {
        highlightedString +=
          `<span style='background:green;'>` +
          htmlString.substring(props.selectionStart, props.selectionEnd) +
          "</span>";
        pointer = props.selectionEnd;
        continue;
      }
      if (htmlString.charAt(pointer) === "#") {
        let closingHashFound = false;
        // closing comment case was handled previously so this must opening #
        // for one line or multiline comment
        for (let i = pointer + 1; i < htmlString.length; i++) {
          if (htmlString.charAt(i) === "#") {
            highlightedString +=
              `<span style='color:${color.gray};'>` +
              htmlString.substring(pointer, i + 1) +
              "</span>";
            pointer = i + 1;
            closingHashFound = true;
            break;
          }
        }
        if (!closingHashFound) {
          // didn't find closing # in loop above
          // so, must be opening # of a multiline comment
          props.insideCommentBlock.current = true;

          highlightedString +=
            `<span style='color:${color.gray};'>` +
            htmlString.substring(pointer, htmlString.length) +
            "</span>";
          pointer = htmlString.length;
        }
      } else if (htmlString.charAt(pointer) === '"') {
        for (let i = pointer + 1; i < htmlString.length; i++) {
          if (htmlString.charAt(i) === '"') {
            highlightedString +=
              `<span style='color:${color.green};'>` +
              htmlString.substring(pointer, i + 1) +
              "</span>";
            pointer = i + 1;
            break;
          }
        }
        highlightedString += htmlString.charAt(pointer);
        pointer++;
      } else {
        highlightedString += htmlString.charAt(pointer);
        pointer++;
      }
    }
    return highlightedString;
  };

  const highLight = (htmlString: string): string => {
    if (props.lineIndex === 0) {
      props.insideCommentBlock.current = false;
    }

    htmlString = highLightCommentAndString(htmlString);

    return htmlString
      .replace(/<span.*?ফাং.*?<\/span>|(ফাং)/gu, (m, group1) => {
        if (group1 === undefined) {
          return m.replace(
            /(<\/span>.*?)ফাং(.*?<span)/gu,
            (newM, newGoup1, newGroup2): string => {
              if (newM) {
                return `${newGoup1}<span style='color:${color.red};'>ফাং</span>${newGroup2}`;
              } else {
                return newM;
              }
            }
          );
        } else {
          return `<span style='color:${color.red};'>${group1}</span>`;
        }
      })
      .replace(/<span.*?নাম.*?<\/span>|(নাম)/gu, (m, group1) => {
        if (group1 === undefined) {
          return m.replace(
            /(<\/span>.*?)নাম(.*?<span)/gu,
            (newM, newGoup1, newGroup2): string => {
              if (newM) {
                return `${newGoup1}<span style='color:${color.blue};'></span>${newGroup2}`;
              } else {
                return newM;
              }
            }
          );
        } else {
          return `<span style='color:${color.blue};'>${group1}</span>`;
        }
      })
      .replace(
        /<span.*?[,;(){}\[\]=].*?<\/span>|([,;(){}\[\]])/gu,
        (m, group1) => {
          if (group1 === undefined) {
            return m.replace(
              /(<\/span>.*?)[,;(){}\[\]=](.*?<span)/gu,
              (newM, newGoup1, newGroup2): string => {
                if (newM) {
                  return `${newGoup1}<span style='color:${color.fg};'></span>${newGroup2}`;
                } else {
                  return newM;
                }
              }
            );
          } else {
            return `<span style='color:${color.fg};'>${group1}</span>`;
          }
        }
      )
      .replace(/<span.*?[=+-/*%].*?<\/span>|([=+-/*%])/gu, (m, group1) => {
        if (group1 === undefined) {
          return m.replace(
            /(<\/span>.*?)[=+-/*%](.*?<span)/gu,
            (newM, newGoup1, newGroup2): string => {
              if (newM) {
                return `${newGoup1}<span style='color:${color.orange};'></span>${newGroup2}`;
              } else {
                return newM;
              }
            }
          );
        } else {
          return `<span style='color:${color.orange};'>${group1}</span>`;
        }
      });
  };

  const escapeHtml = (htmlString: string): string => {
    htmlString = htmlString.replace(/</g, "&lt");
    htmlString = htmlString.replace(/>/g, "&gt");
    htmlString = highLight(htmlString);
    return htmlString;
  };

  const escapedAndHighlightedHtml = useMemo(
    () => escapeHtml(props.txt),
    [props]
  );

  const getSelectionRange = (): [number, number] => {
    const selection = window.getSelection();
    if (selection !== null && !selection.isCollapsed) {
      // This will be wrong if line has similar substring of selection
      const index = props.txt.lastIndexOf(selection.toString());
      if (index === -1) return [-1, -1];
      if (index === props.caretPosition) {
        return [props.caretPosition, props.txt.length];
      } else {
        return [index, props.caretPosition];
      }
      //const selectionStart = index;
      //const selectionEnd = index + selection.toString().length;
      //return [selectionStart, selectionEnd];
    }
    return [-1, -1];
  };

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
        if (window.getSelection()?.isCollapsed) {
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
    }
  });

  const lineNumber = (props.lineIndex + 1).toString();
  let pads = "";
  for (let i = 0; i < props.padding; i++) {
    pads += " ";
  }
  if (props.active) {
    lineStyle = { ...lineStyle, background: color.bg1 };
  } else {
    lineStyle = { ...lineStyle, background: color.bg };
  }
  return (
    <div style={lineStyle}>
      <pre style={lineNumberStyle}>{`${pads}${lineNumber}`}</pre>
      <pre
        className="line"
        style={{ minHeight: "100%", minWidth: "100%" }}
        spellCheck={false}
        ref={lineDivRef}
        dangerouslySetInnerHTML={{ __html: escapedAndHighlightedHtml }}
        contentEditable={true}
        onClick={(_) => props.handleOnClick(props.lineIndex)}
        onInput={(e) => {
          const preElem = e.target as HTMLPreElement;
          props.handleChange(preElem.innerText, props);
        }}
        onKeyDown={(e) => props.handleKeyPress(e, props.lineIndex)}
        onMouseOver={(e) => {
          if (props.mouseDown.current) {
            lineDivRef.current?.focus();
            //setImmediate(() => {
            props.handleMouseOver(props.lineIndex);
            //});

            //props.handleOnClick(props.lineIndex);
          }
        }}
        onBlur={(e) => {
          if (props.mouseDown.current) {
            if (props.previousLineInSelection(props.lineIndex - 1)) {
              console.log(
                "selected: ",
                0,
                props.txt.length,
                `line: ${lineNumber}`
              );
              props.handleOnBlur(props.lineIndex, 0, props.txt.length);
            } else {
              const [selectionStart, selectionEnd] = getSelectionRange();
              console.log(
                "selected: ",
                0,
                props.txt.length,
                `line: ${lineNumber}`
              );
              props.handleOnBlur(props.lineIndex, selectionStart, selectionEnd);
            }
          }
        }}
      ></pre>
    </div>
  );
}

export default Line;
