import React from 'react'

const lineStyle = {
    width:"100%", 
    fontFamily: "monospace",
    display: "flex", 
    flexDirection: "row",
    alignItems: "center",
    whiteSpace: "nowrap"
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
            <div style={lineNumberStyle}>{props.lineNumber + 1}</div>
            <div 
                dangerouslySetInnerHTML={{__html: props.txt}}
                contentEditable={true}
                onChange={(e) => {
                    //console.log(e)
                    props.handleChange(e.target.value, props.lineNumber)}
                }
                onKeyPress={(e) => props.handleKeyPress(e, props.lineNumber)}>
            </div>
        </div>
    )
}

export default Line
