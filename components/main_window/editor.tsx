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
    //newText = newText.replaceAll("\n", "");
    //newText = newText.replaceAll("<div>", "");
    //newText = newText.replaceAll("</div>", "");
    //newText = newText.replaceAll("<br>", "");
    //console.log(lines);

    lines[lineIndex].text = newText;
    lines[lineIndex].active = active;
    const selection = window.getSelection();
    let caretPos = 0;
    if (selection !== null) {
      caretPos = selection.anchorOffset;
    }
    lines[lineIndex].caretPosition = caretPos;
    //console.log(lines);
    //console.log('updated lines: ', lines)
    props.updateLines(lines, props.activeFileName);
  };

  // When enter key is pressed creates a new line
  const handleEnterPress = (text: string, lineIndex: number) => {
    //console.log("----------");
    //console.log(text);
    //text = text.replaceAll("&nbsp;", "");
    //text = text.replaceAll("<div>", "");
    //text = text.replaceAll("</div>", "");
    //text = text.replaceAll("<br>", "");
    //console.log(text)/;
    //console.log("^^^^^^^^^");

    // splitting line two part at caret position
    const selection = window.getSelection();
    let caretPosition = 0;
    if (selection !== null) {
      caretPosition = selection.anchorOffset;
    }
    const firstPartOfLine = text.substring(0, caretPosition);
    const secondPartOfLine = text.substring(caretPosition, text.length);
    console.log("second: " + secondPartOfLine);
    // current line will now contain only first part
    lines[lineIndex].text = firstPartOfLine;
    lines[lineIndex].active = false;
    lines[lineIndex].caretPosition = firstPartOfLine.length;
    // creating new line with lines second part
    const newLine = { text: secondPartOfLine, active: true, caretPosition: 0 };
    lines.splice(lineIndex + 1, 0, newLine);

    props.updateLines(lines, props.activeFileName);
    //console.log(lines);
  };

  // Deletes a line if backspace is pressed at the start of a line
  const handleBackSpacePress = (lineIndex: number) => {
    let updatedLines = lines;
    const selection = window.getSelection();
    let caretPosition = 0;
    if (selection !== null) {
      caretPosition = selection.anchorOffset;
    }
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
      //console.log(filteredLines)
      updatedLines = filteredLines;
    } else {
      // don't need to delete line, just update caret position
      if (updatedLines[lineIndex].caretPosition > 0) {
        updatedLines[lineIndex].caretPosition -= 1;
      }
      console.log("caret: ", caretPosition);
      console.log("elems caret: ", updatedLines[lineIndex].caretPosition);
    }
    props.updateLines(updatedLines, props.activeFileName);
    //console.log(updatedLines);
  };

  const handleArrowRightPress = (lineIndex: number) => {
    if (lines[lineIndex].caretPosition != lines[lineIndex].text.length) {
      lines[lineIndex].caretPosition += 1;
      props.updateLines(lines, props.activeFileName);
      //console.log(lines);
      //console.log(lines[lineIndex]);
    }
  };

  const handleArrowLeftPress = (lineIndex: number) => {
    if (lines[lineIndex].caretPosition != 0) {
      lines[lineIndex].caretPosition -= 1;
      props.updateLines(lines, props.activeFileName);
      //console.log(lines);
      //console.log(lines[lineIndex]);
    }
  };

  const handleArrowUpPress = (lineIndex: number) => {
    if (lineIndex > 0) {
      lines[lineIndex].active = false;
      lines[lineIndex - 1].active = true;
      lines[lineIndex - 1].caretPosition = lines[lineIndex].caretPosition;
      lines[lineIndex].caretPosition = 0;
    }
    props.updateLines(lines, props.activeFileName);
  };

  const handleArrowDownPress = (lineIndex: number) => {
    if (lineIndex < lines.length - 1) {
      lines[lineIndex].active = false;
      lines[lineIndex + 1].active = true;
      lines[lineIndex + 1].caretPosition = lines[lineIndex].caretPosition;
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
        let caretPos = 0;
        const selection = window.getSelection();
        if (selection !== null) {
          caretPos = selection.anchorOffset;
        }
        return {
          ...line,
          active: true,
          caretPosition: caretPos,
        };
      } else {
        return { ...line, active: false };
      }
    });
    //console.log(updatedLines);
    props.updateLines(updatedLines, props.activeFileName);
  };

  const lineComponents = lines.map((line, index) => {
    return (
      <Line
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

export default Editor;
