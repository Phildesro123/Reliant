import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { FaAngleRight } from 'react-icons/fa';
import Comment from './Comment-Component';
import Note from './Note-Component';
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
const Container = React.forwardRef((props, ref) => {
  const minRows = 2;
  const maxRows = 5;
  const [contentList, setContentList] = useState([]);
  const [textAreaText, setTextAreaText] = useState('');
  const [selected, setSelected] = useState(true);
  const textAreaRef = useRef(null);
  const containerRef = useRef(null);
  const height = useRef(null);

  const handleKeyDown = (event) => {
    //escape pressed
    if (event.keyCode === 27) {
      if (contentList.length == 0) {
        props.deleteCallback(props.id);
      } else {
        setSelected(false);
        setTextAreaText('');
      }
      //enter pressed
    } else if (event.keyCode === 13) {
      event.preventDefault();
      commentClicked(textAreaText);
    }
  };

  const handleMouseDown = (event) => {
    if (containerRef.current.contains(event.target)) {
      setSelected(true);
    } else {
      setSelected(false);
      setContentList((contentList) => {
        if (contentList.length == 0) {
          setTextAreaText((textAreaText) => {
            if (textAreaText.trim() == '') {
              props.deleteCallback(containerRef.current.id);
            }
            return textAreaText;
          });
        }

        return contentList;
      });
    }
  };

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

  const commentClicked = (content) => {
    textAreaRef.current.rows = minRows;
    chrome.runtime.sendMessage('userInfo', (userInfo) => {
      const newList = [
        ...contentList,
        props.className == 'comment-container' ? (
          <Comment
            key={'comment_key_' + tempKey}
            displayName={userInfo.email.split('@')[0]}
            id={userInfo.id}
            commentContent={content}
            upVote={50}
            downVote={1}
            canReply={true}
            time={times}
          ></Comment>
        ) : (
          <Note
            key={'note_key_' + tempKey}
            time={times}
            content={content}
          ></Note>
        ),
      ];

      setContentList(newList.map((comment) => comment));
      tempKey += 1;
      setTextAreaText('');
    });
  };

  useEffect(() => {
    //add when mounted
    document.addEventListener('mousedown', handleMouseDown);
    // return funciton to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

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
      className={'bordered-container container ' + props.className}
      style={
        props.className == 'comment-container'
          ? { top: props.top + 'px', right: props.shift + 'px' }
          : { top: props.top + 'px', left: props.shift + 'px' }
      }
    >
      <div className="voting-container"></div>
      <div className="truncate-container">
        <h6 className="truncate-overflow">{props.selectionText}</h6>
      </div>
      {contentList}
      {selected || textAreaText.trim() != '' ? (
        <div>
          <textarea
            ref={textAreaRef}
            className="comment-input"
            type="text"
            placeholder="Comment"
            value={textAreaText}
            rows={minRows}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button
            className="comment-btn"
            disabled={textAreaText.trim() == ''}
            onClick={() => commentClicked(textAreaText)}
          >
            {props.buttonText} <FaAngleRight></FaAngleRight>
          </button>
        </div>
      ) : (
        <span style={{ fontSize: '8pt', color: 'grey' }}>
          Click to add a{' '}
          {props.className == 'comment-container' ? 'comment' : 'note'}.
        </span>
      )}
    </div>
  );
});

export default Container;
