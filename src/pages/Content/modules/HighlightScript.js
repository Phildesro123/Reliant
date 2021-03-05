import React, { useEffect, useState } from 'react';
import HighlightPop from 'react-highlight-pop';

const Highlight = (props) => {
    console.log("Props of this are", props.children);
  return (
      <HighlightPop>
         {props.children} 
      </HighlightPop>
  );
};

export default Highlight;
