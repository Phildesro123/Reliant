import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {FaRegThumbsUp, FaAngleRight} from 'react-icons/fa';
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
  const [upVote, setUpVote] = useState('')
  const [downVote, setDownVote] = useState('')
  const [reply, setReply] = useState('')
  
  useEffect(() => {
      setComment(props.commentContent)
      setName(props.displayName)
      setUpVote(props.upVote)
      setDownVote(props.downVote)
      setReply(props.canReply)

  }, [])

  return (
    <div>
        <p>{comment}</p>
        <p>{name}</p>
        <p>{upVote}</p>
        <p>{downVote}</p>
        <p>{reply}</p>
      <FaRegThumbsUp></FaRegThumbsUp>
    </div>
  );
};

export default Comment;