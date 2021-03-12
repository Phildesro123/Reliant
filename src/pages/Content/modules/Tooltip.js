import React, { useEffect, useState } from 'react';
import {FaRegSmile} from 'react-icons/fa';
import {FaRegFrown} from 'react-icons/fa';
import {FaExclamation} from 'react-icons/fa';
import {FaComment} from 'react-icons/fa';
import {FaStickyNote} from 'react-icons/fa';

const ToolTip = () => {
    return (
      // <Popover style={{backgroundColor: "red"}} id="popover-basic">
      // {/* <Popover.Title as="h3">Options</Popover.Title> */}
      // <Popover.Content>
        //{/* And here's some <strong>amazing</strong> content. It's very engaging.
        //right? */}
        
        <>
        <div className = "btn-group btn-group-sm"> 
         <button type="button" className="btn btn-success" id='smile' title="Green Highlight" onClick={()=>console.log("smile")}> <FaRegSmile /></button>
          <button type="button" className="btn btn-danger" id='frown' title="Red Highlight" onClick={()=>console.log("frown")}> <FaRegFrown/></button>
          <button type="button" className="btn btn-warning" id='highlight' title="Yellow Highlight" onClick={()=>console.log("highlight")}> <FaExclamation/></button>
          <button type="button" className="btn btn-primary" id='comment' title="Create comment" onClick={()=>console.log("comment")}> <FaComment/></button>
          <button type="button" className="btn btn-dark" id='note' title="Personal Note" onClick={()=>console.log("note")}> <FaStickyNote/></button>
        </div>
</>
    // </Popover>
        
  //   <OverlayTrigger trigger="click" placement="top" overlay={popover}>
  //   {/* <Button style={{backgroundColor: "green"}} variant="success">Options</Button> */}
    
  // </OverlayTrigger>
    );
    
}

 export default ToolTip