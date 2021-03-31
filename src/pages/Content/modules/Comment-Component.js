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

  const [time, setTime] = useState(0)

  useEffect(() => {
    setTime(props.time)
  }, [time])

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

  // var today = new Date();
  // const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  return (
    <div>
        <p style={{fontWeight: 'bold', margin: 0}}>{name}</p>
        <p style={{margin: 0}}>{comment}


        <button style={{float: "right"}} onClick={updateUpvote}>{upVote}<FaRegThumbsUp/></button>
        
        </p>

        <p>At time: {time}
          <button style={{float: "right"}} onClick={updateDownVote}>{downVote}<FaRegThumbsDown/>
          </button>
        </p>

        
        


        <p style={{margin: 0}}>{reply}</p>
      
    </div>
  );
};

export default Comment;