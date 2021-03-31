import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {FaAngleRight} from 'react-icons/fa';
import Comment from './Comment-Component';
/**
 * Comment-Container 
 *    Title
 *    List of comments
 *    Add new Comment text_area_ref
 *    Submit/Cancle Buttons
 *    
 * 
 * Comment
 *    author
 *    content
 *    upvote/downvote
 *    elipses(delete/resolve)
 *    time of comment
 *    list of replies
 *    reply (optional : set true for main comment but not sub replies)
 */

var tempKey = 0
function CommentContainer(props) {
  const minRows = 1;
  const maxRows = 5;
  const [commentList, setCommentList] = useState([])
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

  const commentClicked = (commentContent) => {
    setCommentList(commentList => [...commentList, 
      <Comment key={"comment_key_" + tempKey} displayName="User Name" commentContent={commentContent}
      upVote={50} downVote={1} canReply={false}></Comment>
      ]

    )
    tempKey += 1
    setTextAreaText('')
  }

  return (
    <div className="bordered-container comment-container" style={{top: props.startY + "px"}}>
      <div className="voting-container">
      </div>
      <div className="truncate-container">
          <h6 className="truncate-overflow">{props.selectionText}</h6>
      </div>
      {commentList.map((comment, i) => {
        return (
          comment
        )
      })}
      <textarea
        ref={textAreaRef}
        className="comment-input"
        type="text" 
        placeholder="Comment"
        rows={rows}
        value={textAreaText}
        onChange={handleChange}
      />
      <button className="comment-btn" disabled={textAreaText.trim() == ""} onClick={() => commentClicked(textAreaText)}>
        Comment <FaAngleRight></FaAngleRight>
      </button>
    </div>
  );
};

export default CommentContainer;