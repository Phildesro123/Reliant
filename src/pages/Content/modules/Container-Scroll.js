import React, { useState, useImperativeHandle } from 'react';
import Container from './ContainerClass';
import ContainerComponent from './Container-Component';
//TODO: when a container container is clicked scroll the page to the selection location

const margin = 20;
const ContainerScroll = React.forwardRef((props, ref) => {
  const [containerList, setContainerList] = useState([]);
  //remove container and selection
  const deleteContainer = (id) => {
    console.log('Deleting:', id);
    let index = containerList.findIndex((x) => {
      return x.id == id;
    });
    index = index - 1 < 0 ? 0 : index - 1;
    console.log('Index to shift', index);
    const tempList = containerList.filter((x) => {
      return x.id != id;
    });
    if (tempList.length > 0) {
      moveAfterDelete(tempList, index);
    } else {
      setContainerList(tempList);
    }

    console.log('Temp list', tempList);
    let selection = document.getElementById(id.split('_')[0] + '_selection');
    let parent = selection.parentNode;
    while (selection.childNodes.length > 0) {
      parent.insertBefore(selection.childNodes[0], selection);
    }
  };

  //helper function to move surrounding containers out of the way to avoid overlap
  function shiftContainers(list, index) {
    let currentIndex = index;
    list[currentIndex].shift = 80;
    // move any overlapping items above current item up
    while (currentIndex > 0) {
      let currentElement = list[currentIndex];
      let aboveElement = list[currentIndex - 1];
      aboveElement.shift = 0;
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
    while (currentIndex < list.length - 1) {
      let currentElement = list[currentIndex];
      let belowElement = list[currentIndex + 1];
      belowElement.shift = 0;
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
    //updates render even if the list is the same length
    setContainerList([...list]);
  }

  //Callback function passed to container to use when it is updated
  const containerChangedCallback = (containerData) => {
    var elementPos = containerList.findIndex((x) => {
      return x.id == containerData.id;
    });
    const height = containerData.offsetHeight;
    containerList[elementPos].bottom = height + containerList[elementPos].top;
    shiftContainers(containerList, elementPos);
  };

  //Gets called when a selection is clicked and moves appropriate container to selectionTop
  const moveToSelection = (id) => {
    var targetContainer = null;
    var targetId = null;
    for (let i = 0; i < containerList.length; i++) {
      if (containerList[i].id == id) {
        targetContainer = containerList[i];
        targetId = i;
        break;
      }
    }
    if (targetContainer) {
      let height = targetContainer.bottom - targetContainer.top;
      targetContainer.top = targetContainer.selectionTop;
      targetContainer.bottom = targetContainer.top + height;
      shiftContainers(containerList, targetId);
    }
  };

  const moveAfterDelete = (list, index) => {
    let targetContainer = list[index];
    let height = targetContainer.bottom - targetContainer.top;
    targetContainer.top = targetContainer.selectionTop;
    targetContainer.bottom = targetContainer.top + height;
    shiftContainers(list, index);
  };

  //Adds container into array in order or selectionTop
  const addContainer = (
    range,
    id,
    selectionText,
    top,
    startX,
    content = []
  ) => {
    let container = new Container(
      props.type,
      id,
      range,
      selectionText,
      top,
      startX,
      content
    );
    if (containerList.length == 0) {
      // containerList.push(container);
      setContainerList([container]);
    } else {
      let temp = [];
      let index = 0;
      while (
        index < containerList.length &&
        //insert after elements that have a smaller y value
        (container.selectionTop > containerList[index].selectionTop ||
          //insert after elements of the same y value and smaller x
          (container.selectionTop == containerList[index].selectionTop &&
            container.startX > containerList[index].startX))
      ) {
        temp.push(containerList[index]);
        index += 1;
      }
      temp.push(container);
      while (index < containerList.length) {
        temp.push(containerList[index]);
        index += 1;
      }
      setContainerList(temp);
    }
  };

  const containerClicked = (id) => {
    window.scrollBy({ top: 100, behavior: 'smooth' });
    console.log('Container Clicked:', id);
  };

  // Exposes functions to ref (this allows them to be used outside of react components ie in the index.js file)
  useImperativeHandle(ref, () => ({
    addContainer,
    moveToSelection,
  }));

  return (
    <>
      {containerList.map((container, index) => {
        return (
          <ContainerComponent
            className={container.className}
            range={container.range}
            id={container.id}
            key={container.id + '_key'}
            selectionText={container.selectionText}
            top={container.top}
            shift={container.shift}
            containers={container.containers}
            buttonText={container.buttonText}
            callback={containerChangedCallback}
            deleteCallback={deleteContainer}
            clickedCallback={containerClicked}
            content={container.content}
          ></ContainerComponent>
        );
      })}
    </>
  );
});

export default ContainerScroll;
