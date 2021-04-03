import React, {useEffect, useState, useImperativeHandle, useForceUpdate} from 'react';
import {render} from 'react-dom';
import CommentContainerComponent from './Comment-Container';
import {Node, LinkedList} from './Linked-List';

class CommentContainer {
    constructor(id, selectionText, top, startX) {
        this.id = id;
        this.selectionText = selectionText;
        this.selectionTop = top;
        this.top = top;
        this.bottom = 0;
        this.startX = startX;
        this.comments = [];
    }
}
const margin = 20;

const CommentScroll = React.forwardRef((props, ref) => {
    const [commentContainerList, setCommentContainerList] = useState([])
    const [shouldUpdate, setShouldUpdate] = useState(false)
    
    //helper function to move surrounding containers out of the way to avoid overlap
    function shiftContainers(index) {
        let currentIndex = index
        let rerender = false;
        // move any overlapping items above current item up
        while (currentIndex > 0) {
            let currentElement = commentContainerList[currentIndex]
            let aboveElement = commentContainerList[currentIndex - 1]
            if (aboveElement.bottom + margin > currentElement.top) {
                let aboveHeight = aboveElement.bottom - aboveElement.top
                aboveElement.bottom = currentElement.top - margin
                aboveElement.top = aboveElement.bottom - aboveHeight
                rerender = true
            } else {
                break
            }
            currentIndex -= 1
        }

        //move any overlapping items below current item down
        currentIndex = index
        while (currentIndex < commentContainerList.length - 1) {
            let currentElement = commentContainerList[currentIndex]
            let belowElement = commentContainerList[currentIndex + 1]
            if (belowElement.top < currentElement.bottom + margin) {
                let belowHeight = belowElement.bottom - belowElement.top
                belowElement.top = currentElement.bottom + margin
                belowElement.bottom = belowElement.top + belowHeight 
                rerender = true
            } else {
                break
            }
            currentIndex += 1;
        }
        if (rerender) {
            setShouldUpdate(!shouldUpdate)
        }
        
    }
    const commentContainerChanged = (containerData) => {
        var elementPos = commentContainerList.findIndex((x) => {return (x.id == containerData.id);})
        const height = containerData.offsetHeight
        commentContainerList[elementPos].bottom = height + commentContainerList[elementPos].top
        shiftContainers(elementPos)
    }

    //Gets called when a selection is clicked and moves appropriate comment to selectionTop
    const moveContainer = (id) => {
        var targetContainer = null;
        var targetId = null
        for (let i = 0; i < commentContainerList.length; i++) {
            if (commentContainerList[i].id == id) {
                targetContainer = commentContainerList[i]
                targetId = i
                break;
            }
        }
        if (targetContainer) {
            let height = targetContainer.bottom - targetContainer.top
            targetContainer.top = targetContainer.selectionTop
            targetContainer.bottom = targetContainer.top + height
            shiftContainers(targetId)
        }
    }

    //Adds commentContainer into array in order or selectionTop
    const addCommentContainer = (id, selectionText, top, startX) => {
        let comment = new CommentContainer(id, selectionText, top, startX)
        if (commentContainerList.length == 0) {
            setCommentContainerList([comment])
        }
        else {
            let temp = [];
            let index = 0
            while (index < commentContainerList.length && 
                //insert after elements that have a smaller y value
                (comment.selectionTop > commentContainerList[index].selectionTop || 
                    //insert after elements of the same y value and smaller x
                    (comment.selectionTop == commentContainerList[index].selectionTop && comment.startX > commentContainerList[index].startX))) { 

                temp.push(commentContainerList[index])
                index += 1;
            }
            temp.push(comment);
            while (index < commentContainerList.length) {
                temp.push(commentContainerList[index])
                index += 1
            }
            setCommentContainerList(temp)
            moveContainer(id)
        }
       //<CommentContainer selectionText={selectionText} top={top + "px"} callback={commentContainerChanged}></CommentContainer>
    }
    // Exposes functions to ref (this allows them to be used outside of react components ie in the index.js file)
    useImperativeHandle(ref, () => ({
        addCommentContainer,
        moveContainer
    }))
    
    return (<>
        {commentContainerList.map((commentContainer, index) => {
            return <CommentContainerComponent
            id={commentContainer.id}
            key={commentContainer.id}
            selectionText={commentContainer.selectionText} 
            top={commentContainer.top} 
            comments = {commentContainer.comments}
            callback={commentContainerChanged}></CommentContainerComponent>
        })}
        </>);
})

export default CommentScroll;