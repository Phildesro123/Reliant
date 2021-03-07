import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import Overlay from 'react-bootstrap/Overlay';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import {FaRegSmile} from 'react-icons/fa';
import {FaRegFrown} from 'react-icons/fa';
import Popover from 'react-bootstrap/Popover';



const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Popover right</Popover.Title>
      <Popover.Content>
        {/* And here's some <strong>amazing</strong> content. It's very engaging.
        right? */}

        <Button id='smile' onClick={()=>console.log("smile")}> <FaRegSmile /></Button>
        <Button id='frown' onClick={()=>console.log("frown")}> <FaRegFrown/></Button>

        <Button id='highlight' onClick={()=>console.log("highlight")}>highlight</Button>
        <Button id='comment' onClick={()=>console.log("comment")}>comment</Button>
        <Button id='note' onClick={()=>console.log("note")}>note</Button>
      </Popover.Content>
    </Popover>
  );

const ToolTip = () => {
    return (

        
    <OverlayTrigger trigger="click" placement="top" overlay={popover}>
    <Button variant="success">Click me to see</Button>
  </OverlayTrigger>
    );
    //      <>
    //     <Button variant="danger" onClick={() => console.log("Tooltip interaction")}>
    //       Click me to see
    //     </Button>
    //     <Overlay placement="right">
    //       {({ placement, arrowProps, show: _show, popper, ...props }) => (
    //         <div
    //           {...props}
    //           style={{
    //             backgroundColor: 'rgba(255, 100, 100, 0.85)',
    //             padding: '2px 10px',
    //             color: 'white',
    //             borderRadius: 3,
    //             ...props.style,
    //           }}
    //         >
    //           Simple tooltip
    //         </div>
    //       )}
    //     </Overlay>
    //   </>

}

 export default ToolTip