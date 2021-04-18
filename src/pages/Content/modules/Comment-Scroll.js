import React, {
  useEffect,
  useState,
  useImperativeHandle,
  useForceUpdate,
} from 'react';
import { render } from 'react-dom';
import CommentContainerComponent from './Comment-Container';

class CommentContainer {
  constructor(id, selectionText, top, startX) {
    this.id = id;
    this.selectionText = selectionText;
    this.selectionTop = top;
    this.top = top;
    this.bottom = 0;
    this.left = 0;
    this.startX = startX;
    this.comments = [];
  }
}
//TODO: when a comment container is clicked scroll the page to the selection location

const margin = 20;
const CommentScroll = React.forwardRef((props, ref) => {
  const [commentContainerList, setCommentContainerList] = useState([]);
  //removeComment
  const deleteComment = (id) => {
    setCommentContainerList(
      commentContainerList.filter((x) => {
        return x.id != id;
      })
    );
    removeSelection(id);
  };
  //removeSelection
  function removeSelection(selectionTextId) {
    let selection = document.getElementById(selectionTextId);
    let parent = selection.parentNode;
    parent.insertBefore(selection.firstChild, selection);
  }

  //helper function to move surrounding containers out of the way to avoid overlap
  function shiftContainers(index) {
    let currentIndex = index;
    commentContainerList[currentIndex].left = -40;
    // move any overlapping items above current item up
    while (currentIndex > 0) {
      let currentElement = commentContainerList[currentIndex];
      let aboveElement = commentContainerList[currentIndex - 1];
      aboveElement.left = 0;
      let aboveHeight = aboveElement.bottom - aboveElement.top;
      //Move any above elements that won't overlap in their selectionTop position to selectionTop
      if (
        aboveElement.selectionTop + aboveHeight + margin <=
        currentElement.top
      ) {
        aboveElement.top = aboveElement.selectionTop;
        aboveElement.bottom = aboveElement.top + aboveHeight;
      } else {
        //Move above elements up to not overlap
        aboveElement.bottom = currentElement.top - margin;
        aboveElement.top = aboveElement.bottom - aboveHeight;
      }
      currentIndex -= 1;
    }

    //move any overlapping items below current item down
    currentIndex = index;
    while (currentIndex < commentContainerList.length - 1) {
      let currentElement = commentContainerList[currentIndex];
      let belowElement = commentContainerList[currentIndex + 1];
      belowElement.left = 0;
      let belowHeight = belowElement.bottom - belowElement.top;
      //Move any below elements that won't overlap in thier selectionTop position to selectionTop
      if (belowElement.selectionTop - margin > currentElement.bottom) {
        belowElement.top = belowElement.selectionTop;
        belowElement.bottom = belowElement.top + belowHeight;
      } else {
        //Move bottom elements down to not overlap
        belowElement.top = currentElement.bottom + margin;
        belowElement.bottom = belowElement.top + belowHeight;
      }
      currentIndex += 1;
    }
    //updates render even if the commentContainerList is the same length
    setCommentContainerList([...commentContainerList]);
  }

  //Callback function passed to commentContainer to use when it is updated
  const containerChangedCallback = (containerData) => {
    var elementPos = commentContainerList.findIndex((x) => {
      return x.id == containerData.id;
    });
    const height = containerData.offsetHeight;
    commentContainerList[elementPos].bottom =
      height + commentContainerList[elementPos].top;
    shiftContainers(elementPos);
  };

  //Gets called when a selection is clicked and moves appropriate comment to selectionTop
  const moveToSelection = (id) => {
    // console.log('Comment Containers:', commentContainerList);
    var targetContainer = null;
    var targetId = null;
    for (let i = 0; i < commentContainerList.length; i++) {
      if (commentContainerList[i].id == id) {
        targetContainer = commentContainerList[i];
        targetId = i;
        break;
      }
    }
    if (targetContainer) {
      let height = targetContainer.bottom - targetContainer.top;
      targetContainer.top = targetContainer.selectionTop;
      targetContainer.bottom = targetContainer.top + height;
      shiftContainers(targetId);
    }
  };

  //Adds commentContainer into array in order or selectionTop
  const addCommentContainer = (id, selectionText, top, startX) => {
    let comment = new CommentContainer(id, selectionText, top, startX);
    if (commentContainerList.length == 0) {
      // commentContainerList.push(comment);
      setCommentContainerList([comment]);
    } else {
      let temp = [];
      let index = 0;
      while (
        index < commentContainerList.length &&
        //insert after elements that have a smaller y value
        (comment.selectionTop > commentContainerList[index].selectionTop ||
          //insert after elements of the same y value and smaller x
          (comment.selectionTop == commentContainerList[index].selectionTop &&
            comment.startX > commentContainerList[index].startX))
      ) {
        temp.push(commentContainerList[index]);
        index += 1;
      }
      temp.push(comment);
      while (index < commentContainerList.length) {
        temp.push(commentContainerList[index]);
        index += 1;
      }
      setCommentContainerList(temp);
    }
    //<CommentContainer selectionText={selectionText} top={top + "px"} callback={containerChangedCallback}></CommentContainer>
  };
  // Exposes functions to ref (this allows them to be used outside of react components ie in the index.js file)
  useImperativeHandle(ref, () => ({
    addCommentContainer,
    moveToSelection,
  }));

  return (
    <>
      {commentContainerList.map((commentContainer, index) => {
        return (
          <CommentContainerComponent
            id={commentContainer.id}
            key={commentContainer.id}
            selectionText={commentContainer.selectionText}
            top={commentContainer.top}
            left={commentContainer.left}
            comments={commentContainer.comments}
            callback={containerChangedCallback}
            deleteCallback={deleteComment}
          ></CommentContainerComponent>
        );
      })}
    </>
  );
});

export default CommentScroll;
