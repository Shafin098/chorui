import React from "react";
import Line from "./line";

const editorStyle = {
  width: "100%",
  height: "100%",
  overflowX: "scroll",
};

function Editor(props) {
  const lines = props.lines;

  const handleTextChange = (newText, { active, lineIndex }) => {
    //newText = newText.replaceAll("\n", "");
    //newText = newText.replaceAll("<div>", "");
    //newText = newText.replaceAll("</div>", "");
    //newText = newText.replaceAll("<br>", "");
    //console.log(lines);

    lines[lineIndex].text = newText;
    lines[lineIndex].active = active;
    lines[lineIndex].caretPosition = window.getSelection().anchorOffset;
    //console.log(lines);
    //console.log('updated lines: ', lines)
    props.updateLines(lines, props.activeFileName);
  };

  // When enter key is pressed creates a new line
  const handleEnterPress = (text, lineIndex) => {
    //console.log("----------");
    //console.log(text);
    //text = text.replaceAll("&nbsp;", "");
    //text = text.replaceAll("<div>", "");
    //text = text.replaceAll("</div>", "");
    //text = text.replaceAll("<br>", "");
    //console.log(text);
    //console.log("^^^^^^^^^");

    // splitting line two part at caret position
    const caretPosition = window.getSelection().anchorOffset;
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
  const handleBackSpacePress = (lineIndex) => {
    let updatedLines = lines;
    const caretPosition = window.getSelection().anchorOffset;
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

  const handleArrowRightPress = (lineIndex) => {
    if (lines[lineIndex].caretPosition != lines[lineIndex].text.length) {
      lines[lineIndex].caretPosition += 1;
      props.updateLines(lines, props.activeFileName);
      //console.log(lines);
      //console.log(lines[lineIndex]);
    }
  };

  const handleArrowLeftPress = (lineIndex) => {
    if (lines[lineIndex].caretPosition != 0) {
      lines[lineIndex].caretPosition -= 1;
      props.updateLines(lines, props.activeFileName);
      //console.log(lines);
      //console.log(lines[lineIndex]);
    }
  };

  const handleArrowUpPress = (lineIndex) => {
    if (lineIndex > 0) {
      lines[lineIndex].active = false;
      lines[lineIndex - 1].active = true;
      lines[lineIndex - 1].caretPosition = lines[lineIndex].caretPosition;
      lines[lineIndex].caretPosition = 0;
    }
    props.updateLines(lines, props.activeFileName);
  };

  const handleArrowDownPress = (lineIndex) => {
    if (lineIndex < lines.length - 1) {
      lines[lineIndex].active = false;
      lines[lineIndex + 1].active = true;
      lines[lineIndex + 1].caretPosition = lines[lineIndex].caretPosition;
      lines[lineIndex].caretPosition = 0;
    }
    props.updateLines(lines, props.activeFileName);
  };

  const handleKeyPress = (e, lineIndex) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        handleEnterPress(e.target.innerHTML, lineIndex);
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

  const handleOnClick = (lineIndex) => {
    const updatedLines = lines.map((line, index) => {
      if (index === lineIndex) {
        return {
          ...line,
          active: true,
          caretPosition: window.getSelection().anchorOffset,
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
