import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { FaAngleRight } from 'react-icons/fa';
import Comment from './Comment-Component';
import Note from './Note-Component';
import { addOrEditNote, addComment } from '../../../API/APIModule';
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
  const [canSave, setCanSave] = useState(true);
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

  const addContentToList = (content) => {
    setContentList([...contentList, content].map((c) => c));
    tempKey += 1;
    setTextAreaText('');
  };

  const commentClicked = (content) => {
    textAreaRef.current.rows = minRows;
    chrome.runtime.sendMessage('userInfo', (userInfo) => {
      chrome.runtime.sendMessage('activeURL', (url) => {
        const displayName = userInfo.email.split('@')[0];
        if (props.className == 'comment-container') {
          //Save Comment
          addComment(url, userInfo.id, displayName, props.range, content)
            .then((response) => {
              console.log('Add Comment Response', response);
              addContentToList(
                <Comment
                  key={'comment_key_' + tempKey}
                  displayName={displayName}
                  id={userInfo.id}
                  commentContent={content}
                  upVote={0}
                  downVote={0}
                  canReply={false}
                  time={times}
                ></Comment>
              );
            })
            .catch((err) => {
              console.log('Add Note Error', err);
              setCanSave(false);
            });
        } else {
          //Save Note
          addOrEditNote(userInfo.id, url, props.range, content)
            .then((response) => {
              console.log('Add Note Response', response);
              addContentToList(
                <Note
                  key={'note_key_' + tempKey}
                  time={times}
                  content={content}
                ></Note>
              );
            })
            .catch((err) => {
              console.log('Add Note Error:', err);
              setCanSave(false);
            });
        }
      });
    });
  };

  useEffect(() => {
    props.content.forEach((content) => {
      if (props.className == 'comment-container') {
        addContentToList(
          <Comment
            key={'comment_key_' + tempKey}
            displayName={content.ownerName}
            id={content.userId}
            commentContent={content.content}
            upVote={content.upVotes}
            downVote={content.downVotes}
            canReply={false}
            time={content.time}
          ></Comment>
        );
      } else {
        addContentToList(
          <Note
            key={'note_key_' + tempKey}
            time={content.time}
            content={content.content}
          ></Note>
        );
      }
    });
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
            style={!canSave ? { backgroundColor: 'red' } : {}}
          >
            {canSave ? props.buttonText : 'Error: please reload'}{' '}
            <FaAngleRight></FaAngleRight>
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
