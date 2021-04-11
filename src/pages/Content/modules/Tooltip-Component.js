import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import {FaRegSmile} from 'react-icons/fa';
import {FaRegFrown} from 'react-icons/fa';
import {FaExclamation} from 'react-icons/fa';
import {FaComment} from 'react-icons/fa';
import {FaStickyNote} from 'react-icons/fa';


let tooltip = document.createElement('div');
tooltip.id = "reliant-tooltip"
tooltip.className = "btn-group btn-group-sm";

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
         <button type="button" className="btn btn-success" id='button-fix' title="Green Highlight" onClick={()=>console.log("smile")}> <FaRegSmile id = "smile"/></button>
          <button type="button" className="btn btn-danger" id='button-fix' title="Red Highlight" onClick={()=>console.log("frown")}> <FaRegFrown id ="frown"/></button>
          <button type="button" className="btn btn-warning" id='button-fix' title="Yellow Highlight" onClick={()=>console.log("highlight")}> <FaExclamation id ="highlight"/></button>
          <button type="button" className="btn btn-primary" id='button-fix' title="Create comment" onClick={()=>console.log("comment")}> <FaComment id = "comment"/></button>
          <button type="button" className="btn btn-dark" id='button-fix' title="Personal Note" onClick={()=>console.log("note")}> <FaStickyNote id ="note"/></button>
        </>
    );
    
}