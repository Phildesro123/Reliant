import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {FaRegThumbsUp, FaRegThumbsDown, FaAngleRight} from 'react-icons/fa';
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
 * 
 * 
 * props. :
 * displayName: String
 * upVote/downVote: int
 * commentContent: String
 * canReply: boolean
 */
class callbackData {
  constructor(top, horizontal, bottom) {
    this.top = top;
    this.horizontal = horizontal;
    this.bottom = bottom;
  }
}

function Comment(props) {
  
  const [upVote, setUpVote] = useState(props.upVote)
  const [downVote, setDownVote] = useState(props.downVote)

  function updateUpvote() {
    setUpVote(upVote + 1)
  }
  function updateDownVote() {
    setDownVote(downVote - 1)
  }

  return (
    <div className="comment">
      <div style={{display: 'flex', justifyContent:"space-between"}}>
        <div style={{display: 'flex', flexDirection:"column"}}>
          <p style={{fontWeight: 'bold', margin: 0}}>{props.displayName}</p>
          <p style={{marginTop:"auto" , marginLeft:'20px', marginBottom:"auto", marginRight:"auto", fontSize:"12pt", lineHeight:"normal"}}>{props.commentContent}</p>
        </div>
        <div style={{display:"flex", flexDirection:"column", alignItems: "flex-end", marginRight: "10px"}}>
          <button className="vote-btn" onClick={updateUpvote}>
            <div style={{display:"inline-flex"}}>
              <p className="vote-count">{upVote}</p><FaRegThumbsUp style={{margin:"auto"}}/>
            </div>
          </button> 
          <button className="vote-btn" onClick={updateDownVote}>
            <div style={{display:"inline-flex"}}>
                <p className="vote-count">{downVote}</p><FaRegThumbsDown style={{margin:"auto"}}/>
            </div>
          </button>
        </div>
      </div>
      <div style={{display:"inline-flex", justifyContent:"space-between", alignItems:"baseline", width:"100%"}}>
      <span style={{margin: 0, marginLeft:'20px', fontSize:"8pt" ,color:"grey"}}>At time: {props.time}</span>
        <span></span>
        {props.canReply ? <button style={{color:"lightblue", fontSize:'10pt', marginRight:"20px"}}>reply</button> : null}
      </div>
    </div>
  );
};

export default Comment;