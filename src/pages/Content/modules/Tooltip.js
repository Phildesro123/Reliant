import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import Overlay from 'react-bootstrap/Overlay';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import {FaRegSmile} from 'react-icons/fa';
import {FaRegFrown} from 'react-icons/fa';
import {FaExclamation} from 'react-icons/fa';
import {FaComment} from 'react-icons/fa';
import {FaStickyNote} from 'react-icons/fa';


import Popover from 'react-bootstrap/Popover';



const popover = (
    <Popover style={{backgroundColor: "red"}} id="popover-basic">
      {/* <Popover.Title as="h3">Options</Popover.Title> */}
      <Popover.Content>
        {/* And here's some <strong>amazing</strong> content. It's very engaging.
        right? */}

        <Button id='smile' onClick={()=>console.log("smile")}> <FaRegSmile /></Button>
        <Button id='frown' onClick={()=>console.log("frown")}> <FaRegFrown/></Button>
        <Button id='highlight' onClick={()=>console.log("highlight")}> <FaExclamation/></Button>
        <Button id='comment' onClick={()=>console.log("comment")}> <FaComment/></Button>
        <Button id='note' onClick={()=>console.log("note")}> <FaStickyNote/></Button>
      </Popover.Content>
    </Popover>
  );

const ToolTip = () => {
    return (
      <Popover style={{backgroundColor: "red"}} id="popover-basic">
      {/* <Popover.Title as="h3">Options</Popover.Title> */}
      <Popover.Content>
        {/* And here's some <strong>amazing</strong> content. It's very engaging.
        right? */}

        <Button id='smile' onClick={()=>console.log("smile")}> <FaRegSmile /></Button>
        <Button id='frown' onClick={()=>console.log("frown")}> <FaRegFrown/></Button>
        <Button id='highlight' onClick={()=>console.log("highlight")}> <FaExclamation/></Button>
        <Button id='comment' onClick={()=>console.log("comment")}> <FaComment/></Button>
        <Button id='note' onClick={()=>console.log("note")}> <FaStickyNote/></Button>
      </Popover.Content>
    </Popover>
        
  //   <OverlayTrigger trigger="click" placement="top" overlay={popover}>
  //   {/* <Button style={{backgroundColor: "green"}} variant="success">Options</Button> */}
    
  // </OverlayTrigger>
    );
    
}

 export default ToolTip