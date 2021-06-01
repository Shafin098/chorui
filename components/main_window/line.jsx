import React from 'react'

const lineStyle = {
    width:"100%", 
    fontFamily: "monospace",
    display: "flex", 
    flexDirection: "row",
    alignItems: "center",
}

const lineNumberStyle = {
    background: "#eee",
    color: "rgb(50, 50, 255)",
    padding: "0.2em",
    marginRight: "0.4rem"
}


function Line(props) {
    return (
        <div style={lineStyle}>
            <div style={lineNumberStyle}>{props.lineNumber}</div>
            <div contentEditable={true}
                    onChange={(e) => {
                        console.log(e.target.value)
                        console.log(props)
                        props.handleChange(e.target.value, props.lineNumber)
                    }}>
                {props.txt}
            </div>
        </div>
    )
}

export default Line
