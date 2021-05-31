import React from 'react'
import Line from './line'

const lines = [
    "this is a test 1",
    "this is a test 2",
    "this is a test 3",
    "this is a test 4",
    "this is a test 5",
]

const editorStyle = {
    width: "100%",
    height: "100%"
}

function Editor() {
    const lineComponents = lines.map((line, index) => <Line key={index} txt={line} number={index}/>)
    return (
        <div style={editorStyle}>
            {lineComponents}
        </div>
    )
}

export default Editor
