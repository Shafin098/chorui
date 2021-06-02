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

    const handleEnterPress = (text, lineIndex) => {
        console.log(text, lineIndex)
        text = text.replace("&nbsp;", "")
        text = text.replace("</div>", "")
        text = text.replace("<br>", "")

        const splits = text.split("<div>")
        lines[lineIndex].text = splits[0]
        lines.splice(lineIndex + 1, 0, {text: splits[1], active: true})
        lines[lineIndex].active = false
        console.log(lines)
        setLines([...lines])
    }

    const handleKeyPress = (e, lineNumber) => {
        if (e.key === "Enter") {
            setTimeout(() => handleEnterPress(e.target.innerHTML, lineNumber), 0)
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
