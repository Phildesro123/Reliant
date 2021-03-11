
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
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous"/>
        <div className = "btn-group btn-group-sm"> 
         <button type="button" className="btn btn-Success" id='smile' onClick={()=>console.log("smile")}> <FaRegSmile /></button>
          <button type="button" className="btn btn-primary" id='frown' onClick={()=>console.log("frown")}> <FaRegFrown/></button>
          <button type="button" className="btn btn-primary" id='highlight' onClick={()=>console.log("highlight")}> <FaExclamation/></button>
          <button type="button" className="btn btn-primary" id='comment' onClick={()=>console.log("comment")}> <FaComment/></button>
          <button type="button" className="btn btn-primary" id='note' onClick={()=>console.log("note")}> <FaStickyNote/></button>
        </div>
</>
    // </Popover>
        
  //   <OverlayTrigger trigger="click" placement="top" overlay={popover}>
  //   {/* <Button style={{backgroundColor: "green"}} variant="success">Options</Button> */}
    
  // </OverlayTrigger>
    );
    
}

 export default ToolTip