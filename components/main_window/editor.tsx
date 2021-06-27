import React, { CSSProperties } from "react";
import Line from "./line";
import { LineType, LinePropType } from "./line";

const editorStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  overflowX: "scroll",
};

type EditorPropType = {
  lines: LineType[];
  activeFileName: string;
  updateLines: (lines: LineType[], activeFileName: string) => void;
};

function Editor(props: EditorPropType) {
  const lines = props.lines;

  const handleTextChange = (
    newText: string,
    { active, lineIndex }: LinePropType
  ): void => {
    lines[lineIndex].text = newText;
    lines[lineIndex].active = active;
    lines[lineIndex].caretPosition = getCaretPosition();
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
    const newLine = { text: secondPartOfLine, active: true, caretPosition: 0 };
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
      const newMergedLine = {
        text: mergedLineText,
        active: true,
        caretPosition: lines[lineIndex - 1].text.length,
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
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        const elem = e.target as HTMLElement;
        handleEnterPress(elem.innerHTML, lineIndex);
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
        };
      } else {
        return { ...line, active: false };
      }
    });
    props.updateLines(updatedLines, props.activeFileName);
  };

  const lineComponents = lines.map((line, index) => {
    const lineNumLeftPadding =
      lines.length.toString().length - (index + 1).toString().length;
    return (
      <Line
        padding={lineNumLeftPadding}
        key={`${index}${line}`}
        active={line.active}
        txt={line.text}
        caretPosition={line.caretPosition}
        lineIndex={index}
        handleChange={handleTextChange}
        handleKeyPress={handleKeyPress}
        handleOnClick={handleOnClick}
      />
    );
  });

  return <div style={editorStyle}>{lineComponents}</div>;
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

export default Editor;
