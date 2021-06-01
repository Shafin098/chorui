import React, { useState } from 'react'
import Line from './line'

const editorStyle = {
    width: "100%",
    height: "100%"
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
        console.log('updated lines: ', lines)
        setLines([...lines])
    }

    const lineComponents = lines.map((line, index) => {
            return <Line key={`${index}${line}`} txt={line} lineNumber={index} handleChange={handleTextChange}/>
    })
    return (
        <div style={editorStyle}>
            {lineComponents}
        </div>
    )
}

export default Editor
