import React from 'react';
import { render } from 'react-dom';
import rangy from 'rangy';
import 'rangy/lib/rangy-textrange';
/* ===================================================================== */
import { URLS } from '../Background/workingUrls';
import { createTooltip, removeTooltip } from './modules/Tooltip-Component';
import { createQuestionnaire, removeQuestionnaire } from './Questionnaire';
import { authorName } from './authorName';
import {
  addSite,
  addHighlights,
  getUserHighlights,
  updateWebsite,
  getNotes,
  getComments,
} from '../../API/APIModule';
import ContainerScroll from './modules/Container-Scroll';
import Container from './modules/ContainerClass';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');
var ACTIVATED = false;
var LOADED = false;
var paragraphs = null;
var currentURL = null;
var currentHostname = null;
var currentUserInfo = null;
var showTooltip = false;
var classApplier;
function getLoadedState() {
  return LOADED;
}
//TODO: FIX ACTIVATE IN POPUP WHEN RELIANT AUTO LOADS IT SHOULD CHANGE TO DEACTIVATE
function getActivateState() {
  return ACTIVATED;
}

async function getURL() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage('activeURL', (url) => {
      resolve(url);
    });
  });
}

async function getUserInfo() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage('userInfo', (userInfo) => {
      resolve(userInfo);
    });
  });
}
var first = true; //Used to ensure the questionnaire can only be injected once.
var colors = []; // Array holding paragraph colors in the form [original, random]
var even = 0; // 0 --> Original Color, 1 --> Random Color
window.onload = async function () {
  rangy.init();
  LOADED = true;
  console.log('Reliant Activated');
  currentHostname = new URL(await getURL()).hostname;
  activateReliant();
};
var timeOpened = new Date().getTime();

async function activateReliant() {
  if (!LOADED) {
    console.log('page not loaded');
    return; // Prevents Reliant from being activated if the site is not done loading.
  }
  ACTIVATED = true;
  console.log('activated reliant', getActivateState());
  currentURL = await getURL();
  currentUserInfo = await getUserInfo();
  currentHostname = new URL(currentURL).hostname;

  const noteScroll = document.createElement('div');
  noteScroll.className = 'reliant-scroll note-scroll';
  //Creates notes scroll
  render(
    <ContainerScroll
      type="note"
      ref={(cs) => {
        window.noteScroll = cs;
      }}
    ></ContainerScroll>,
    noteScroll
  );
  // document.body.appendChild(noteScroll);
  const commentScroll = document.createElement('div');
  commentScroll.className = 'reliant-scroll comment-scroll';
  //Creates commentScroll
  render(
    <ContainerScroll
      type="comment"
      ref={(cs) => {
        window.commentScroll = cs;
      }}
    ></ContainerScroll>,
    commentScroll
  );
  // document.body.appendChild(commentScroll);
  let main = null;
  if (currentHostname.includes(URLS.CNN)) {
    main = document.getElementsByClassName('l-container')[0];
    console.log(main);
  } else {
    console.log('CREATEING WIRED SCROLL');
    main = document.getElementsByTagName('main')[0];

    if (currentHostname.includes(URLS.WIRED)) {
      let gridContent = document.getElementsByClassName('article__chunks')[0]
        .childNodes;
      for (let i = 0; i < gridContent.length; i++) {
        console.log('Here', gridContent[i].classList);
        console.log(gridContent[i].className);
        gridContent[i].className = '';
      }
    }

    if (currentHostname.includes(URLS.VOX)) {
      var parent = main.parentNode;

      // move all children out of the element
      while (main.firstChild) parent.insertBefore(main.firstChild, main);

      // remove the empty element
      parent.removeChild(main);
      main = parent;
    }
  }
  main.style.margin = 0;
  let currentParent = main.parentNode;
  let wrapperDiv = document.createElement('div');
  wrapperDiv.style.display = 'inline-flex';
  wrapperDiv.style.width = '100%';
  wrapperDiv.style.margin = 'auto';
  currentParent.replaceChild(wrapperDiv, main);

  wrapperDiv.appendChild(noteScroll);
  wrapperDiv.appendChild(main);
  wrapperDiv.appendChild(commentScroll);

  updateWebsite(currentUserInfo.id, { _id: currentURL, timespent: 0 })
    .then(() => {
      console.log('Data has been sent to the server');
    })
    .catch((err) => {
      console.log('Internal server error in updateSites:', err);
    });

  addSite(currentURL)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log('Internal server error in addSite:', err);
    });

  let scrollTop =
    window.pageYOffset +
    document.getElementsByClassName('reliant-scroll')[0].getBoundingClientRect()
      .top;
  getComments(currentURL).then((res) => {
    console.log('getComments:', res.data);
    window.commentScroll.dumpContainers(
      res.data.map((commentContainer) => {
        const commentRange = deserializeSelection(commentContainer.range);
        const selectionText = commentRange.toString();
        const selectionTopY =
          commentRange.nativeRange.getBoundingClientRect().y +
          window.pageYOffset;
        const id = highlightText(
          '#dc3545',
          commentRange,
          'reliant-comment',
          true
        );

        return new Container(
          'comment',
          id,
          commentContainer.range,
          selectionText,
          selectionTopY - scrollTop,
          0,
          commentContainer.comments.map((comment) => {
            return {
              userId: comment.ownerID,
              displayName: comment.ownerName,
              content: comment.content,
              time: comment.time,
              upVotes: comment.upvotes,
              downVotes: comment.downvotes,
            };
          })
        );
      })
    );
  });
  getNotes(currentURL, currentUserInfo.id).then((res) => {
    console.log('getNotes:', res.data);
    window.noteScroll.dumpContainers(
      res.data.map((note) => {
        const noteRange = deserializeSelection(note.range);
        const selectionText = noteRange.toString();
        const selectionTopY =
          noteRange.nativeRange.getBoundingClientRect().y + window.pageYOffset;
        const id = highlightText('blue', noteRange, 'reliant-note', true);
        return new Container(
          'note',
          id,
          note.range,
          selectionText,
          selectionTopY - scrollTop,
          0,
          [{ content: note.content, time: note.time }]
        );
      })
    );
  });
  getUserHighlights(currentURL, currentUserInfo.id)
    .then((res) => {
      const rootNode = document.getElementsByName('html');
      console.log('Root node', rootNode);

      if (res.data.frowns.length > 0) {
        res.data.frowns.forEach((element) => {
          try {
            highlightText(
              '#dc3545',
              deserializeSelection(element.selection),
              'reliant-frown'
            );
            clearSelection();
          } catch (error) {
            console.log('Frown error:', error);
            console.log('Highlight failed to restore');
          }
        });
      }
      if (res.data.smiles.length > 0) {
        res.data.smiles.forEach((element) => {
          try {
            highlightText(
              '#28a745',
              deserializeSelection(element.selection).nativeRange,
              'reliant-smile'
            );
            clearSelection();
          } catch (error) {
            console.log('Smile error:', error);
            console.log('Highlight failed to restore');
          }
        });
      }
      if (res.data.highlights.length > 0) {
        res.data.highlights.forEach((element) => {
          try {
            highlightText(
              '#ffc107',
              deserializeSelection(element.selection).nativeRange,
              'reliant-highlight'
            );
            clearSelection();
          } catch (error) {
            console.log('Highlight error:', error);
            console.log('Highlight Failed to restore');
          }
        });
      }
    })
    .catch((err) => {
      console.log('Internal server error in getUserHighlights:', err);
    });

  if (first) {
    createQuestionnaire(currentUserInfo.id, currentURL, currentHostname);

    //Highlight everything
    even = (even + 1) % 2;

    var mouseDownX = 0;
    var selectionTopY = 0;
    let range = null;
    var tooltipClicked = false;
    var savedSelection = null;

    function hasSomeParentTheClass(element, classname) {
      if (!element || typeof element.classList === 'undefined') return false;
      if (element.classList.contains(classname)) return true;
      return hasSomeParentTheClass(element.parentNode, classname);
    }

    /**Mouse events to handle tooltip interaction */
    document.addEventListener('mousedown', (e) => {
      mouseDownX = e.pageX;
      showTooltip = true;

      // remove all selected css styles when you click anywhere on the screen
      Array.prototype.forEach.call(
        document.getElementsByClassName('reliant-selected'),
        (element) => {
          element.classList.remove('reliant-selected');
        }
      );

      // checks if the tooltip was pressed if not it removes it
      tooltipClicked = false;
      if (hasSomeParentTheClass(e.target.parentNode, 'reliant-tooltip')) {
        tooltipClicked = true;
      } else {
        removeTooltip();
      }

      //checks if click was inside comment
      if (hasSomeParentTheClass(e.target.parentNode, 'bordered-container')) {
        clearSelection();
        showTooltip = false;
        return false;
      }
    });

    // If there is a selection on mouse up and its valid the tooltip will be presented
    document.addEventListener('mouseup', (e) => {
      if (tooltipClicked || !showTooltip) return false;
      let selection = window.getSelection();
      let selectionText = selection.toString();

      // Triggers when multi paragraph selection occurs
      if (
        !(
          selection.baseNode == selection.focusNode ||
          selection.baseNode.parentNode == selection.focusNode.parentNode
        )
      ) {
        //TODO: Add modal to tell user that reliant doesn't support multiple paragraph selections
        console.log('Please dont select multiple paragraphs');
        removeTooltip();
        clearSelection();
        return false;
      }

      //Render the tooltip
      if (selectionText.length > 0) {
        range = selection.getRangeAt(0);
        savedSelection = serializeCurrentSelection();
        console.log('The saved selection is: ', savedSelection);
        const boundingBox = range.getBoundingClientRect();
        const selectionCenterX = (mouseDownX + boundingBox.right) / 2;
        selectionTopY = boundingBox.y + window.pageYOffset;
        createTooltip(selectionCenterX, selectionTopY);
      } else {
        showTooltip = false;
        removeTooltip();
      }
    });

    //Handles a button click on the tool tip, ignores other clicks
    document.addEventListener('click', (e) => {
      //only run if tooltip is clicked
      if (!tooltipClicked) return false;
      clearSelection();
      let scrollTop =
        window.pageYOffset +
        document
          .getElementsByClassName('reliant-scroll')[0]
          .getBoundingClientRect().top;

      const parentIdName = e.target.parentNode.getAttribute('id');
      const currentID = e.target.getAttribute('id');
      let highlightSelection = savedSelection;
      console.log('Parent ID name:', parentIdName);
      console.log('Current ID name:', currentID);
      if (parentIdName == 'highlight' || currentID == 'highlight') {
        addHighlights(
          currentURL,
          currentUserInfo.id,
          highlightSelection,
          'highlights'
        ).then((res) => {
          console.log(res);
        });
        highlightText('#ffc107', range, 'reliant-highlight');
        removeTooltip();
      } else if (parentIdName == 'smile' || currentID == 'smile') {
        addHighlights(
          currentURL,
          currentUserInfo.id,
          highlightSelection,
          'smiles'
        ).then((res) => {
          console.log(res);
        });
        highlightText('#28a745', range, 'reliant-smile');
        removeTooltip();
      } else if (parentIdName == 'frown' || currentID == 'frown') {
        addHighlights(
          currentURL,
          currentUserInfo.id,
          highlightSelection,
          'frowns'
        ).then((res) => {
          console.log(res);
        });
        highlightText('#dc3545', range, 'reliant-frown');
        removeTooltip();
      } else if (parentIdName == 'comment' || currentID == 'comment') {
        const id = highlightText('#dc3545', range, 'reliant-comment', true);
        window.commentScroll.addContainer(
          highlightSelection,
          id,
          range.toString(),
          selectionTopY - scrollTop,
          mouseDownX
        );
        removeTooltip();
      } else if (parentIdName == 'note' || currentID == 'note') {
        const id = highlightText('blue', range, 'reliant-note', true);
        window.noteScroll.addContainer(
          highlightSelection,
          id,
          range.toString(),
          selectionTopY - scrollTop,
          mouseDownX
        );
        removeTooltip();
      }
    });

    function deactivateReliant() {
      ACTIVATED = false;
      console.log('Deactivating Reliant');
      removeQuestionnaire();
      // Implement removing highlight
      var i = 0;
      for (const paragraph of paragraphs) {
        paragraph.style['background-color'] = colors[i][0];
        i++;
      }
    }

    //Runs when activate is pressed from Popup
    chrome.runtime.onMessage.addListener((req, send, sendResponse) => {
      if (req.type === 'activate') {
        activateReliant();
      } else if (req.type === 'getAuthors') {
        getURL().then((url) => {
          sendResponse(authorName(new URL(url).hostname));
        });
      } else if (req.type === 'deactivate') {
        deactivateReliant();
      }
      return true;
    });
  }

  var selectionTextId = 0;
  const highlightText = (color, range, className, underline = false) => {
    let containerId =
      className + '-' + selectionTextId.toString() + '_container';
    var mark = document.createElement('span');
    if (underline) {
      mark = document.createElement('u');
      mark.style.textDecoration = 'underline';
      mark.style.textDecorationColor = color;
      mark.style.textDecorationThickness = '.2rem';
      mark.style.textDecorationSkipInk = 'none';
    } else {
      mark.style.backgroundColor = color;
    }

    mark.className = className;
    mark.id = className + '-' + selectionTextId.toString() + '_selection';
    mark.onclick = () => {
      if (mark.className == 'reliant-comment') {
        window.commentScroll.moveToSelection(containerId);
      } else if (mark.className == 'reliant-note') {
        window.noteScroll.moveToSelection(containerId);
      }
      mark.className += ' reliant-selected';
    };

    mark.appendChild(range.extractContents()); //Append the contents of the selection's range to our mark tag
    mark.normalize();
    range.deleteContents(); // Not sure if this is necessary, but just in case I'm removing the rangeContents to make sure no extra elements
    range.insertNode(mark); // Insert mark into the range
    selectionTextId += 1;
    return containerId;
  };
}

function deserializeSelection(selection) {
  const baseSelection = rangy.getSelection(document.documentElement);
  const selItem = JSON.parse(selection);
  baseSelection.removeAllRanges();
  const parentRange = rangy.createRange();
  parentRange.selectNodeContents(document.documentElement);

  const findRange = rangy.createRange();
  const findOptions = {
    withinRange: parentRange,
  };
  let findCount = 0;
  while (findRange.findText(selItem.Text, findOptions)) {
    if (findCount === selItem.FindIndex) {
      //todo -- do something with the range;
      baseSelection.setSingleRange(findRange);
      return findRange;
    }
    findRange.collapse(false);
    findCount++;
  }
  return null;
}

function clearSelection() {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selectionText) {
    document.selectionText.empty();
  }
}
function serializeCurrentSelection() {
  const sel = rangy.getSelection();
  let selectedText = sel.toString();
  const parentRange = rangy.createRange();

  selectedText = selectedText.replace(/\xA0/g, ' ');
  parentRange.selectNodeContents(document.documentElement);
  const selToSerialzie = {
    Text: selectedText,
    FindIndex: -1,
  };

  const findRange = rangy.createRange();
  const findOptions = {
    withinRange: parentRange,
  };
  let findCount = 0;
  while (findRange.findText(selectedText, findOptions)) {
    const intersects = findRange.intersection(sel._ranges[0]);
    if (intersects && intersects !== null) {
      console.log('Something intersected');
      selToSerialzie.FindIndex = findCount;
      break;
    }
    findRange.collapse(false);
    findCount++;
  }
  return JSON.stringify(selToSerialzie);
}
