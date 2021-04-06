import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { FaAngleRight } from 'react-icons/fa';
import Comment from './Comment-Component';
/**
 * Comment-Container
 *    Title (Selected Text)
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

//TODO: On click scroll page to comment
var tempKey = 0;
const CommentContainer = React.forwardRef((props, ref) => {
  const minRows = 2;
  const maxRows = 5;
  const [commentList, setCommentList] = useState([]);
  const [textAreaText, setTextAreaText] = useState('');
  const textAreaRef = useRef(null);
  const containerRef = useRef(null);
  const height = useRef(null);

  const handleChange = (event) => {
    const textAreaLineHeight = parseInt(
      window
        .getComputedStyle(ReactDOM.findDOMNode(textAreaRef.current))
        .getPropertyValue('line-height'),
      10
    );
    const previousRows = event.target.rows;
    event.target.rows = minRows;
    const currentRows = ~~(event.target.scrollHeight / textAreaLineHeight);
    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }
    if (currentRows >= maxRows) {
      event.target.scrollTop = event.target.scrollHeight;
    }
    event.target.rows = currentRows < maxRows ? currentRows : maxRows;
    setTextAreaText(event.target.value);
  };

  var today = new Date();
  const times =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

  const commentClicked = (commentContent) => {
    textAreaRef.current.rows = minRows;
    const newList = [
      ...commentList,
      <Comment
        key={'comment_key_' + tempKey}
        displayName="User Name"
        commentContent={commentContent}
        upVote={50}
        downVote={1}
        canReply={true}
        time={times}
      ></Comment>,
    ];

    setCommentList(newList.map((comment) => comment));
    tempKey += 1;
    setTextAreaText('');
  };

  useEffect(() => {
    const offsetHeight = containerRef.current.offsetHeight;
    //check if height is changed (the - 1 and + 1 are there since offsetHeight is converted from float to int so this accommodates the rounding errors)
    const changed = !(
      offsetHeight - 1 <= height.current && height.current <= offsetHeight + 1
    );
    if (changed) {
      const previousHeight = height.current;
      height.current = offsetHeight;
      props.callback(containerRef.current);
    }
  });

  return (
    <div
      id={props.id}
      ref={containerRef}
      className="bordered-container comment-container"
      style={{ top: props.top + 'px', left: props.left + 'px' }}
    >
      <div className="voting-container"></div>
      <div className="truncate-container">
        <h6 className="truncate-overflow">{props.selectionText}</h6>
      </div>
      {commentList}
      <textarea
        ref={textAreaRef}
        className="comment-input"
        type="text"
        placeholder="Comment"
        value={textAreaText}
        rows={minRows}
        onChange={handleChange}
      />
      <button
        className="comment-btn"
        disabled={textAreaText.trim() == ''}
        onClick={() => commentClicked(textAreaText)}
      >
        Comment <FaAngleRight></FaAngleRight>
      </button>
    </div>
  );
});

export default CommentContainer;
