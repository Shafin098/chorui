import React, { CSSProperties, useEffect, useRef } from "react";
import Line from "./line";
import { LineType, LinePropType } from "./line";
import { color } from "./util/color";

const editorStyle: CSSProperties = {
  backgroundColor: color.bg,
  width: "100%",
  height: "100%",
  overflowX: "scroll",
};

type EditorPropType = {
  lines: LineType[];
  activeFileName: string;
  updateLines: (lines: LineType[], activeFileName: string) => void;
};

export default function Editor(props: EditorPropType) {
  const lines = props.lines;

  useEffect(() => {
    const ctrlC_listener = (e: KeyboardEvent) => {
      if (e.key == "c" && e.ctrlKey) {
        let text = "";

        for (let i = 0; i < props.lines.length; i++) {
          if (
            props.lines[i].selectionStart > -1 &&
            props.lines[i].selectionEnd > -1
          ) {
            text +=
              props.lines[i].text.substring(
                props.lines[i].selectionStart,
                props.lines[i].selectionEnd
              ) + "\n";
          }
        }
        // this is will only work if selection is top to bottom
        // TODO: make it also work for bottom to top selection
        text += window.getSelection()?.toString();

        navigator.clipboard.writeText(text);
        console.log(text);
        props.updateLines([...lines], props.activeFileName);
      }
    };
    window.addEventListener("keydown", ctrlC_listener);

    return () => {
      window.removeEventListener("keydown", ctrlC_listener);
    };
  });

  const clearTextSelection = () => {
    for (let i = 0; i < lines.length; i++) {
      lines[i].selectionStart = -1;
      lines[i].selectionEnd = -1;
      props.updateLines([...lines], props.activeFileName);
    }
  };

  const handleTextChange = (
    newText: string,
    { active, lineIndex }: LinePropType
  ): void => {
    newText = newText.replace(/\t/gu, "    ");
    // pasted text could have multiple lines
    const newLines = newText.split("\n");
    lines[lineIndex].text = newLines[0];
    lines[lineIndex].active = active;
    lines[lineIndex].caretPosition = getCaretPosition();
    // this loop will only run if newText has multiple
    // lines (pasted text could have multiple lines)
    // appending to lines array if multiple lines are found
    for (let i = 1; i < newLines.length; i++) {
      const line: LineType = {
        text: newLines[i],
        active: false,
        caretPosition: 0,
        selectionStart: -1,
        selectionEnd: -1,
      };
      lines.splice(lineIndex + 1, 0, line);
      lineIndex += 1;
    }
    props.updateLines(lines, props.activeFileName);
  };

  // When enter key is pressed creates a new line
  const handleEnterPress = (text: string, lineIndex: number) => {
    // splitting line two part at caret position
    let caretPosition = getCaretPosition();
    const firstPartOfLine = text.substring(0, caretPosition);
    const secondPartOfLine = text.substring(caretPosition, text.length);
    // current line will now contain only first part
    lines[lineIndex].text = firstPartOfLine;
    lines[lineIndex].active = false;
    lines[lineIndex].caretPosition = firstPartOfLine.length;
    // creating new line with lines second part
    const newLine: LineType = {
      text: secondPartOfLine,
      active: true,
      caretPosition: 0,
      selectionStart: -1,
      selectionEnd: -1,
    };
    lines.splice(lineIndex + 1, 0, newLine);

    props.updateLines(lines, props.activeFileName);
  };

  // Deletes a line if backspace is pressed at the start of a line
  const handleBackSpacePress = (lineIndex: number) => {
    let updatedLines = lines;
    let caretPosition = getCaretPosition();
    // caret is at the start of the line and backspace pressed
    // so, needs to delete this line
    // first line shouldn't be backspace-able
    if (caretPosition == 0 && lineIndex != 0) {
      // filtering out backspaced line
      const filteredLines = lines.filter((_, currentIndex) => {
        return currentIndex != lineIndex;
      });
      const mergedLineText = `${filteredLines[lineIndex - 1].text}${
        lines[lineIndex].text
      }`;
      const newMergedLine: LineType = {
        text: mergedLineText,
        active: true,
        caretPosition: lines[lineIndex - 1].text.length,
        selectionStart: -1,
        selectionEnd: -1,
      };
      filteredLines[lineIndex - 1] = newMergedLine;
      updatedLines = filteredLines;
    } else {
      // don't need to delete line, just update caret position
      if (updatedLines[lineIndex].caretPosition > 0) {
        updatedLines[lineIndex].caretPosition -= 1;
      }
    }
    props.updateLines(updatedLines, props.activeFileName);
  };

  const handleArrowRightPress = (lineIndex: number) => {
    if (lines[lineIndex].caretPosition != lines[lineIndex].text.length) {
      lines[lineIndex].caretPosition += 1;
      props.updateLines(lines, props.activeFileName);
    }
  };

  const handleArrowLeftPress = (lineIndex: number) => {
    if (lines[lineIndex].caretPosition != 0) {
      lines[lineIndex].caretPosition -= 1;
      props.updateLines(lines, props.activeFileName);
    }
  };

  const handleArrowUpPress = (lineIndex: number) => {
    if (lineIndex > 0) {
      lines[lineIndex].active = false;
      lines[lineIndex - 1].active = true;
      // newly active line should have atleast less or equal number of characters
      // to previously active lines caret position.
      // If not caret should be at the end of the line (which is lines character length)
      if (lines[lineIndex].caretPosition <= lines[lineIndex - 1].text.length) {
        lines[lineIndex - 1].caretPosition = lines[lineIndex].caretPosition;
      } else {
        lines[lineIndex - 1].caretPosition = lines[lineIndex - 1].text.length;
      }
      lines[lineIndex].caretPosition = 0;
    }
    props.updateLines(lines, props.activeFileName);
  };

  const handleArrowDownPress = (lineIndex: number) => {
    if (lineIndex < lines.length - 1) {
      lines[lineIndex].active = false;
      lines[lineIndex + 1].active = true;
      // newly active line should have atleast less or equal number of characters
      // to previously active lines caret position
      // If not caret should be at the end of the line (which is lines character length)
      if (lines[lineIndex].caretPosition <= lines[lineIndex + 1].text.length) {
        lines[lineIndex + 1].caretPosition = lines[lineIndex].caretPosition;
      } else {
        lines[lineIndex + 1].caretPosition = lines[lineIndex + 1].text.length;
      }
      lines[lineIndex].caretPosition = 0;
    }
    props.updateLines(lines, props.activeFileName);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLPreElement>,
    lineIndex: number
  ) => {
    //clearTextSelection();
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        const elem = e.target as HTMLElement;
        handleEnterPress(elem.innerText, lineIndex);
        break;
      case "Backspace":
        handleBackSpacePress(lineIndex);
        break;
      case "ArrowRight":
        handleArrowRightPress(lineIndex);
        break;
      case "ArrowLeft":
        handleArrowLeftPress(lineIndex);
        break;
      case "ArrowUp":
        handleArrowUpPress(lineIndex);
        break;
      case "ArrowDown":
        handleArrowDownPress(lineIndex);
        break;
      default:
        console.log(e.key);
    }
  };

  const handleOnClick = (lineIndex: number): void => {
    const updatedLines = lines.map((line, index) => {
      if (index === lineIndex) {
        return {
          ...line,
          active: true,
          caretPosition: getCaretPosition(),
          selectionStart: -1,
          selectionEnd: -1,
        };
      } else {
        return { ...line, active: false, selectionStart: -1, selectionEnd: -1 };
      }
    });
    props.updateLines(updatedLines, props.activeFileName);
  };

  const handleOnBlur = (
    lineIndex: number,
    selectionStart: number,
    selectionEnd: number
  ): void => {
    lines[lineIndex].selectionStart = selectionStart;
    lines[lineIndex].selectionEnd = selectionEnd;
    lines[lineIndex].active = false;
    props.updateLines([...lines], props.activeFileName);
  };

  const handleMouseOver = (lineIndex: number): void => {
    lines[lineIndex].active = true;
    props.updateLines([...lines], props.activeFileName);
  };

  const isLineSelected = (lineIndex: number): boolean => {
    if (lineIndex < 1) {
      return false;
    }
    const line = props.lines[lineIndex];
    if (line.selectionStart !== -1 && line.selectionEnd !== -1) {
      return true;
    } else {
      return false;
    }
  };

  // for tracking multiline comment block
  const insideCommentBlock = useRef(false);
  const mouseDown = useRef(false);

  const lineComponents = lines.map((line, index) => {
    const lineNumLeftPadding =
      lines.length.toString().length - (index + 1).toString().length;
    return (
      <Line
        insideCommentBlock={insideCommentBlock}
        mouseDown={mouseDown}
        selectionStart={line.selectionStart}
        selectionEnd={line.selectionEnd}
        padding={lineNumLeftPadding}
        key={`${index}${line}`}
        active={line.active}
        txt={line.text}
        caretPosition={line.caretPosition}
        lineIndex={index}
        handleChange={handleTextChange}
        handleKeyPress={handleKeyPress}
        handleOnClick={handleOnClick}
        handleOnBlur={handleOnBlur}
        handleMouseOver={handleMouseOver}
        previousLineInSelection={isLineSelected}
      />
    );
  });

  return (
    <div
      id="editor"
      style={editorStyle}
      onMouseDown={(e) => {
        if (e.button === 0) {
          mouseDown.current = true;
          console.log("pressed");
        }
      }}
      onMouseUp={(e) => {
        if (e.button === 0) {
          mouseDown.current = false;
          console.log("released");
        }
      }}
    >
      {lineComponents}
    </div>
  );
}

/**
 * Retuns where caret is at Line component
 * caution:
 * caret position is not from component state,
 * caret position is calcualted by window.getSelection() then adjusted by adding
 * previous all siblings text length
 */
function getCaretPosition(): number {
  const selection = window.getSelection();
  if (selection !== null) {
    // Nasty dom traversing!!
    // if caret is in a span window.getSelction return textNode inside span element
    // so checking seletions anchor node's parent is span, if span going one level up
    // then getting sibling node
    let node = selection.anchorNode;
    if (node?.parentNode?.nodeName === "SPAN") {
      node = node.parentNode.previousSibling;
    } else {
      if (node !== null) {
        node = node.previousSibling;
      }
    }

    // Traversing all previous sibling node to adjust caret position
    let adjustmentToCaret = 0;
    while (node) {
      if (node.nodeName === "SPAN") {
        const n = node as HTMLElement;
        adjustmentToCaret += n.innerText.length;
      } else {
        if (node.textContent !== null) {
          adjustmentToCaret += node.textContent.length;
        }
      }
      node = node.previousSibling;
    }
    return selection.anchorOffset + adjustmentToCaret;
  }
  return 0;
}
