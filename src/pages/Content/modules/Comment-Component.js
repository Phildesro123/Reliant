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


function Comment(props) {
  
  const [comment, setComment] = useState('')
  const [name, setName] = useState('')
  const [upVote, setUpVote] = useState(0)
  const [downVote, setDownVote] = useState(0)
  const [reply, setReply] = useState(false)

  //Run once at creation
  useEffect(() => {
      setComment(props.commentContent)
      setName(props.displayName)
      setUpVote(props.upVote)
      setDownVote(props.downVote)
      setReply(props.canReply)

  }, [])
  
  function updateUpvote() {
    setUpVote(upVote + 1)
    
  }
  function updateDownVote() {
    setDownVote(downVote - 1)
  }


  return (
    <div>
        <p style={{margin: 0}}>{comment}</p>
        <p style={{fontWeight: 'bold', margin: 0}}>{name}</p>
        {/* <p style={{margin: 0}}><FaRegThumbsUp></FaRegThumbsUp>{upVote}</p> */}
 
        <button onClick={updateUpvote}>{upVote}<FaRegThumbsUp/></button>
        <button onClick={updateDownVote}>{downVote}<FaRegThumbsDown/></button>

        {/* <p style={{margin: 0}}><FaRegThumbsDown></FaRegThumbsDown>{downVote}</p> */}
        <p style={{margin: 0}}>{reply}</p>
      
    </div>
  );
};

export default Comment;