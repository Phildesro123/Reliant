import React from 'react';
import { render } from 'react-dom';

import rangySerializer from 'rangy/lib/rangy-serializer';
import CommentScroll from './modules/Comment-Scroll';
import { URLS } from '../Background/workingUrls';
import axios from 'axios';
import { createTooltip, removeTooltip } from './modules/Tooltip-Component';
import { createQuestionnaire, removeQuestionnaire } from './Questionnaire';
import { authorName } from './authorName';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

var ACTIVATED = false;
var LOADED = false;
var paragraphs = null;
var currentURL = null;
var currentHostname = null;
var currentUserInfo = null;
var showTooltip = false;

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
  LOADED = true;
  console.log('LOADED');
  currentHostname = new URL(await getURL()).hostname;
  console.log(currentHostname);
  for (const key in URLS) {
    if (currentHostname.includes(URLS[key])) {
      activateReliant();
      break;
    }
  }
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

  axios
    .post('http://localhost:4000/api/user/updateSites', {
      _id: currentUserInfo.id,
      website: {
        _id: currentURL,
        timespent: 0,
      },
    })
    .then(() => {
      console.log('Data has been sent to the server');
    })
    .catch((err) => {
      console.log('Internal server error in updateSites:', err);
    });

  axios
    .post('http://localhost:4000/api/websites/addSite', {
      _id: currentURL,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log('Internal server error in addSite:', err);
    });

  axios
    .get('http://localhost:4000/api/websites/getUserHighlights', {
      params: {
        url: currentURL,
        userID: currentUserInfo.id,
      },
    })
    .then((res) => {
      const rootNode = document.getElementsByName('html');
      console.log('Root node', rootNode);

      if (res.data.frowns.length > 0) {
        res.data.frowns.forEach((element) => {
          if (rangySerializer.canDeserializeRange(element.selection)) {
            try {
              highlightText(
                '#dc3545',
                rangySerializer.deserializeRange(element.selection, rootNode[0])
                  .nativeRange,
                'reliant-frown'
              );
            } catch (error) {
              console.log('Frown error:', error);
              console.log('Highlight failed to restore');
            }
          }
        });
      }
      if (res.data.smiles.length > 0) {
        res.data.smiles.forEach((element) => {
          if (rangySerializer.canDeserializeRange(element.selection)) {
            try {
              highlightText(
                '#28a745',
                rangySerializer.deserializeRange(element.selection, rootNode[0])
                  .nativeRange,
                'reliant-smile'
              );
            } catch (error) {
              console.log('Smile error:', error);
              console.log('Highlight failed to restore');
            }
          }
        });
      }
      if (res.data.highlights.length > 0) {
        res.data.highlights.forEach((element) => {
          if (rangySerializer.canDeserializeRange(element.selection)) {
            try {
              highlightText(
                '#ffc107',
                rangySerializer.deserializeRange(element.selection, rootNode[0])
                  .nativeRange,
                'reliant-highlight'
              );
            } catch (error) {
              console.log('Highlight error:', error);
              console.log('Highlight Failed to restore');
            }
          }
        });
      }
    })
    .catch((err) => {
      console.log('Internal server error in getUserHighlights:', err);
    });

  if (first) {
    createQuestionnaire(currentUserInfo.id, currentURL, currentHostname);
    const commentScroll = document.createElement('div');
    commentScroll.className = 'comment-scroll';
    render(
      <CommentScroll
        ref={(cs) => {
          window.commentScroll = cs;
        }}
      ></CommentScroll>,
      commentScroll
    );
    document.body.appendChild(commentScroll);
    //Highlight everything
    even = (even + 1) % 2;

    function clearSelection() {
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      } else if (document.selectionText) {
        document.selectionText.empty();
      }
    }

    var mouseDownX = 0;
    var selectionTopY = 0;
    let range = null;
    var tooltipClicked = false;

    function hasSomeParentTheClass(element, classname) {
      if (!element || typeof element.classList === 'undefined') return false;
      if (element.classList.contains(classname)) return true;
      return hasSomeParentTheClass(element.parentNode, classname);
    }

    /**Mouse events to handle tooltip interaction */
    document.addEventListener('mousedown', (e) => {
      mouseDownX = e.pageX;
      showTooltip = true;

      // remove all selected css styles when you click anywher on the screen
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
        //TODO: Add modal to tell user that reliant doesn't support multip paragraph selections
        console.log('Please dont select multiple paragraphs');
        removeTooltip();
        clearSelection();
        return false;
      }

      //Render the tooltip
      if (selectionText.length > 0) {
        range = selection.getRangeAt(0);
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
      const parentIdName = e.target.parentNode.getAttribute('id');
      const currentID = e.target.getAttribute('id');

      let payload = {
        url: currentURL,
        userID: currentUserInfo.id,
        highlightSelection: rangySerializer.serializeRange(
          range,
          true,
          document.getElementsByName('html')[0]
        ), // Serializes the range into a string to store in DB
        highlight_type: null,
      };

      if (parentIdName == 'highlight' || currentID == 'highlight') {
        payload.highlight_type = 'highlights';
        axios
          .post('http://localhost:4000/api/websites/addHighlights', payload)
          .then((res) => {
            console.log(res);
          });
        highlightText('#ffc107', range, 'reliant-highlight');
        removeTooltip();
      } else if (parentIdName == 'smile' || currentID == 'smile') {
        payload.highlight_type = 'smiles';
        axios
          .post('http://localhost:4000/api/websites/addHighlights', payload)
          .then((res) => {
            console.log(res);
          });
        highlightText('#28a745', range, 'reliant-smile');
        removeTooltip();
      } else if (parentIdName == 'frown' || currentID == 'frown') {
        payload.highlight_type = 'frowns';
        axios
          .post('http://localhost:4000/api/websites/addHighlights', payload)
          .then((res) => {
            console.log(res);
          });
        highlightText('#dc3545', range, 'reliant-frown');
        removeTooltip();
      } else if (parentIdName == 'comment' || currentID == 'comment') {
        const id = highlightText('#dc3545', range, 'reliant-comment', true);
        window.commentScroll.addCommentContainer(
          id,
          range.toString(),
          selectionTopY,
          mouseDownX
        );
        removeTooltip();
      } else if (parentIdName == 'note' || currentID == 'note') {
        highlightText('blue', range, 'reliant-note', true);
        // TODO: Implement note
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
    mark.id = selectionTextId;
    mark.onclick = () => {
      mark.className += ' reliant-selected';
      window.commentScroll.moveContainer(parseInt(mark.id));
    };

    mark.appendChild(range.extractContents()); //Append the contents of the selection's range to our mark tag
    mark.normalize();
    console.log('Mark element:', mark);
    range.deleteContents(); // Not sure if this is necessary, but just in case I'm removing the rangeContents to make sure no extra elements
    range.insertNode(mark); // Insert mark into the range
    console.log('Range after highlight:', range);
    selectionTextId += 1;
    return parseInt(mark.id);
  };
}
