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
    
    function shiftContainers(index) {
        let currentIndex = index
        let rerender = false;
        // move any overlapping items above current item up
        while (currentIndex > 0) {
            let currentElement = commentContainerList[currentIndex]
            let aboveElement = commentContainerList[currentIndex - 1]
            console.log("Above Element", aboveElement)
            console.log("Current Element", currentElement)
            if (aboveElement.bottom + margin > currentElement.top) {
                console.log("Change Above Happening")
                let aboveHeight = aboveElement.bottom - aboveElement.top
                aboveElement.bottom = currentElement.top - margin
                aboveElement.top = aboveElement.bottom - aboveHeight
                console.log("New Above Element", aboveElement)
                rerender = true
            } else {
                break
            }
            currentIndex -= 1
        }

        //move any overlapping items below current item down
        currentIndex = index
        console.log(commentContainerList.length - 1)
        while (currentIndex < commentContainerList.length - 1) {
            let currentElement = commentContainerList[currentIndex]
            let belowElement = commentContainerList[currentIndex + 1]
            console.log("Current Element", currentElement)
            console.log("Below Element", belowElement)
            if (belowElement.top < currentElement.bottom + margin) {
                console.log("Change Below Happening")
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
            console.log("Rerender is true")
            setShouldUpdate(!shouldUpdate)
        }
        
    }
    const commentContainerChanged = (containerData) => {
        var elementPos = commentContainerList.findIndex((x) => {return (x.id == containerData.id);})
        const height = containerData.offsetHeight
        commentContainerList[elementPos].bottom = height + commentContainerList[elementPos].top
        shiftContainers(elementPos)
    }

    const moveContainer = (id) => {
        console.log("MOVING CONTAINER")
        var targetContainer = null;
        var targetId = null
        console.log(commentContainerList)
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

    const addCommentContainer = (id, selectionText, top, startX) => {
        console.log("Adding Comment Container")
        console.log("ID", id)
        let comment = new CommentContainer(id, selectionText, top, startX)
        if (commentContainerList.length == 0) {
            setCommentContainerList([comment])
        }
        else {
            let temp = [];
            let index = 0
            while (index < commentContainerList.length && comment.selectionTop >= commentContainerList[index].selectionTop) {
                temp.push(commentContainerList[index])
                index += 1;
            }
            temp.push(comment);
            while (index < commentContainerList.length) {
                temp.push(commentContainerList[index])
                index += 1
            }
            setCommentContainerList(temp)
        }
       //<CommentContainer selectionText={selectionText} top={top + "px"} callback={commentContainerChanged}></CommentContainer>
    }
    // Exposes functions to ref (this allows them to be used outside of react components ie in the index.js file)
    useImperativeHandle(ref, () => ({
        addCommentContainer,
        moveContainer
    }))

    useEffect(() => {
        console.log("SCROLL RERENDERED")
    })
    
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