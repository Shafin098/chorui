import React, { useState } from 'react'
import Line from './line'

const editorStyle = {
    width: "100%",
    height: "100%",
    overflowX: "scroll"
}

function Editor() {
    const [lines, setLines] = useState([
        {text: "this is a test 1", active: false},
        {text: "this is a test 2", active: false},
        {text: "this is a test 3", active: false},
        {text: "this is a test 4", active: false},
        {text: "this is a test 5", active: false}
    ])

    const handleTextChange = (newText, lineNumber) => {
        lines[lineNumber] = newText
        //console.log('updated lines: ', lines)
        setLines([...lines])
    }

    // When enter key is pressed creates a new line
    const handleEnterPress = (text, lineIndex) => {
        //console.log(text, lineIndex)
        text = text.replace("&nbsp;", "")
        text = text.replace("</div>", "")
        text = text.replace("<br>", "")

        const splits = text.split("<div>")
        lines[lineIndex].text = splits[0]
        lines.splice(lineIndex + 1, 0, {text: splits[1], active: true})
        lines[lineIndex].active = false
        //console.log(lines)
        setLines([...lines])
    }

    // Deletes a line if backspace is pressed at the start of a line
    const handleBackSpacePress = (lineIndex) => {
        const caretPosition = window.getSelection().anchorOffset
        // caret is at the start of the line and backspace pressed
        // so, needs to delete this line
        if (caretPosition == 0) {
            // filtering out backspaced line
            const filteredLines = lines.filter((_, currentIndex) => {
                return currentIndex != lineIndex
            })
            const mergedLines =  `${filteredLines[lineIndex-1].text}${lines[lineIndex].text}`
            filteredLines[lineIndex-1] = {text: mergedLines, active: true}
            console.log(filteredLines)
            setLines(filteredLines)
        }
    }

    const handleKeyPress = (e, lineIndex) => {
        switch (e.key) {
            case "Enter":
                setTimeout(() => handleEnterPress(e.target.innerHTML, lineIndex), 0)
                break
            case "Backspace":
                handleBackSpacePress(lineIndex)
            default:
                console.log(e.key)
        }
    }

    const lineComponents = lines.map((line, index) => {
            return <Line key={`${index}${line.text}`} 
                        active={line.active}
                        txt={line.text}
                        lineNumber={index} 
                        handleChange={handleTextChange}
                        handleKeyPress={handleKeyPress}/>
    })
    return (
        <div style={editorStyle}>
            {lineComponents}
        </div>
    )
}

export default Editor
