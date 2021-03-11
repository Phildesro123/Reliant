import React, {useEffect, useState} from 'react';
import {FaRegThumbsUp} from 'react-icons/fa';

function Comment() {
    return (
    <div className="bordered-container comment-container">
      <div className="voting-container">
       
      </div>
      <h1>This is the comment title</h1>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius
        aspernatur ad ab veritatis explicabo sit repellat earum porro deserunt?
        Modi ipsum repellendus consequatur nisi dolorem natus, qui fugit iste
        possimus.
      </p>
      <div className="comment-input-container">
        <input className="comment-input" type="text" placeholder="Comment" />
        <input className="comment-btn" type="button"/>
        {/* <FaRegThumbsUp></FaRegThumbsUp> */}
      </div>
    </div>
    );
};

export default Comment;