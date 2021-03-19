import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {FaRegThumbsUp, FaAngleRight} from 'react-icons/fa';

function Comment() {
  const minRows = 2;
  const maxRows = 7;
  const [comment, setComment] = useState('')
  const [rows, setRows] = useState(minRows)
  const [textAreaText, setTextAreaText] = useState('')
  const textAreaRef = useRef(null);

  const handleChange = (event) => {
    const textAreaLineHeight = parseInt(window.getComputedStyle(ReactDOM.findDOMNode(textAreaRef.current)).getPropertyValue('line-height'), 10);

    const previousRows = event.target.rows;
    event.target.rows = minRows
    const currentRows = ~~(event.target.scrollHeight / textAreaLineHeight);

    if (currentRows === previousRows) {
      event.target.rows = currentRows
    }

    if (currentRows >= maxRows) {
      event.target.rows = maxRows;
      event.target.scrollTop = event.target.scrollHeight;
    } 
    setRows(currentRows < maxRows ? currentRows : maxRows)
    setTextAreaText(event.target.value)
  }

  const commentClicked= () => {
    setComment(textAreaText)
    setTextAreaText('')
  }

  return (
    <div className="bordered-container comment-container">
      <div className="voting-container">
        
      </div>
      <h1>This is the comment title</h1>
      <p>{comment}</p>
      <textarea
        ref={textAreaRef}
        className="comment-input"
        type="text" 
        placeholder="Comment"
        rows={rows}
        value={textAreaText}
        onChange={handleChange}
      />
      <button className="comment-btn" onClick={commentClicked}>
        Comment <FaAngleRight></FaAngleRight>
      </button>
      <FaRegThumbsUp></FaRegThumbsUp>
    </div>
  );
};

export default Comment;