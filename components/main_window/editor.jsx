import React, { useState } from 'react'
import Line from './line'

const editorStyle = {
    width: "100%",
    height: "100%",
    overflowX: "scroll"
}

function Editor() {
    const [lines, setLines] = useState([
        {text: "this is a test 1", active: true, caretPosition: 0},
        {text: "this is a test 2", active: false, caretPosition: 0},
        {text: "this is a test 3", active: false, caretPosition: 0},
        {text: "this is a test 4", active: false, caretPosition: 0},
        {text: "this is a test 5", active: false, caretPosition: 0}
    ])

    const handleTextChange = (newText, {active, lineIndex}) => {
        console.log(lines)
        console.log(newText)
        lines[lineIndex].text =  newText
        lines[lineIndex].active = active
        lines[lineIndex].caretPosition = window.getSelection().anchorOffset
        console.log(lines)
        //console.log('updated lines: ', lines)
        setLines([...lines])
    }

    // When enter key is pressed creates a new line
    const handleEnterPress = (text, lineIndex) => {
        text = text.replace("&nbsp;", "")
        text = text.replace("<div>", "")
        text = text.replace("</div>", "")
        text = text.replace("<br>", "")

        // splitting line two part at caret position
        const caretPosition = window.getSelection().anchorOffset
        const firstPartOfLine = text.substring(0, caretPosition)
        const seconfPartOfLine = text.substring(caretPosition, text.length)
        // current line will now contain only first part
        lines[lineIndex].text = firstPartOfLine
        lines[lineIndex].active = false
        lines[lineIndex].caretPosition = firstPartOfLine.length
        // creating new line with lines second part
        const newLine = {text: seconfPartOfLine, active: true, caretPosition: 0}
        lines.splice(lineIndex + 1, 0, newLine)

        setLines([...lines])
        console.log(lines)
    }

    // Deletes a line if backspace is pressed at the start of a line
    const handleBackSpacePress = (lineIndex) => {
        let updatedLines = lines
        // first line shouldn't be backspace-able
        if (lineIndex !== 0) {
            const caretPosition = window.getSelection().anchorOffset
            // caret is at the start of the line and backspace pressed
            // so, needs to delete this line
            if (caretPosition == 0) {
                // filtering out backspaced line
                const filteredLines = lines.filter((_, currentIndex) => {
                    return currentIndex != lineIndex
                })
                const mergedLineText =  `${filteredLines[lineIndex-1].text}${lines[lineIndex].text}`
                const newMergedLine = {
                    text: mergedLineText, 
                    active: true, 
                    caretPosition: lines[lineIndex-1].text.length
                }
                filteredLines[lineIndex-1] =  newMergedLine
                //console.log(filteredLines)
                updatedLines = filteredLines
            }
        }
        setLines(updatedLines)
        console.log(updatedLines)
    }

    const handleKeyPress = (e, lineIndex) => {
        switch (e.key) {
            case "Enter":
                handleEnterPress(e.target.innerHTML, lineIndex)
                break
            case "Backspace":
                handleBackSpacePress(lineIndex)
            default:
                //console.log(e.key)
        }
    }

    const handleOnClick = (lineIndex) => {
        const updatedLines = lines.map((line, index) => {
            if (index === lineIndex) {
                return {...line, active: true, 
                        caretPosition: window.getSelection().anchorOffset}
            } else {
                return {...line, active: false}
            }
        })
        console.log(updatedLines)
        setLines(updatedLines)
    }

    const lineComponents = lines.map((line, index) => {
            return <Line key={line.text} 
                        active={line.active}
                        txt={line.text}
                        caretPosition={line.caretPosition}
                        lineIndex={index} 
                        handleChange={handleTextChange}
                        handleKeyPress={handleKeyPress}
                        handleOnClick={handleOnClick}/>
    })
    return (
        <div style={editorStyle}>
            {lineComponents}
        </div>
    )
}

export default Editor
