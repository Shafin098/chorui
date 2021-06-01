import React, { useState } from 'react'
import Line from './line'

const editorStyle = {
    width: "100%",
    height: "100%",
    overflowX: "scroll"
}

function Editor() {
    const [lines, setLines] = useState([
        "this is a test 1",
        "this is a test 2",
        "this is a test 3",
        "this is a test 4",
        "this is a test 5"
    ])

    const handleTextChange = (newText, lineNumber) => {
        lines[lineNumber] = newText
        //console.log('updated lines: ', lines)
        setLines([...lines])
    }

    const handleEnterPress = (text, lineIndex) => {
        console.log(text, lineIndex)
        text = text.replace("&nbsp;", "")
        text = text.replace("</div>", "")
        text = text.replace("<br>", "")
        const splits = text.split("<div>")
        lines[lineIndex] = splits[0]
        lines.splice(lineIndex + 1, 0, splits[1])
        console.log(lines)
        setLines([...lines])
    }

    const handleKeyPress = (e, lineNumber) => {
        if (e.key === "Enter") {
            setTimeout(() => handleEnterPress(e.target.innerHTML, lineNumber), 0)
        }
    }

    const lineComponents = lines.map((line, index) => {
            return <Line key={`${index}${line}`} 
                        txt={line}
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
