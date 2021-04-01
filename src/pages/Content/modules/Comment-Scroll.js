import React, {useEffect, useState, useImperativeHandle} from 'react';
import ReactDom from 'react-dom';
import CommentContainer from './Comment-Container';


const CommentScroll = React.forwardRef((props, ref) => {
    const [commentContainers, setCommentContainers] = useState([])
    useImperativeHandle(ref, () => ({
        addCommentContainer : (selectionText, top) => {
            console.log("Adding Comment Container")
            setCommentContainers(commentContainers => [...commentContainers, <CommentContainer selectionText={selectionText} top={top + "px"} callback={commentContainerChanged}></CommentContainer>])
        },
        commentContainerChanged: (containerData) => {
            console.log("Comment Container", commentContainers)
            for (const container in commentContainers) {
                console.log(container)
            }
            console.log("Callback Data:", containerData)
        }
    }))
    
    // Load stored comments from db
    useEffect(() => {
        addCommentContainer("This is a test comment", 100)
        addCommentContainer("This is a test comment", 300)
        addCommentContainer("This is a test comment", 500)
    }, [])
    return (<>
        {commentContainers.map((commentContainer, index) => {
            console.log("commentContainer:", commentContainer)
            return commentContainer
        })}
        </>);
})

export default CommentScroll;