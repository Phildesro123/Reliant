import React from 'react';
import { render } from 'react-dom';
import { FaRegSmile } from 'react-icons/fa';
import { FaRegFrown } from 'react-icons/fa';
import { FaExclamation } from 'react-icons/fa';
import { FaComment } from 'react-icons/fa';
import { FaStickyNote } from 'react-icons/fa';


let tooltip = document.createElement('div');
tooltip.id = "reliant-tooltip"
tooltip.className = "reliant-tooltip btn-group btn-group-sm";

export function createTooltip(x, y) {
    tooltip.style.top = y + 'px';
    tooltip.style.left = x + 'px';
    render(<ToolTip />, tooltip);
    document.body.appendChild(tooltip);
}

export function removeTooltip() {
    tooltip.remove();
}

const ToolTip = () => {
    return (
        <>
            <button type="button" className="btn btn-success" id='smile' title="Green Highlight" onClick={() => console.log("smile")}> <FaRegSmile id="smile-icon" /></button>
            <button type="button" className="btn btn-danger" id='frown' title="Red Highlight" onClick={() => console.log("frown")}> <FaRegFrown id="frown-icon" /></button>
            <button type="button" className="btn btn-warning" id='highlight' title="Yellow Highlight" onClick={() => console.log("highlight")}> <FaExclamation id="highlight-icon" /></button>
            <button type="button" className="btn btn-primary" id='comment' title="Create comment" onClick={() => console.log("comment")}> <FaComment id="comment-icon" /></button>
            <button type="button" className="btn btn-dark" id='note' title="Personal Note" onClick={() => console.log("note")}> <FaStickyNote id="note-icon" /></button>
        </>
    );

}