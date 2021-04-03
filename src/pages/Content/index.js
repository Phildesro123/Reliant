import React from 'react';
import { render } from 'react-dom';
import rangySerializer from 'rangy/lib/rangy-serializer';
import { URLS } from '../Background/workingUrls';
import axios from 'axios';
import { calculateScore } from '../../containers/Score/Score';
import ToolComponent from './modules/Tooltip-Component';
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
var selectionY = null;

function getLoadedState() {
  return LOADED;
}
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
        timespent: 5,
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
              rangySerializer.deserializeRange(element.selection).nativeRange
            ); 
            } catch (error){
              console.log("Highlight failed to restore");
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
              rangySerializer.deserializeRange(element.selection).nativeRange
            );
            } catch (error) {
              console.log("Highlight failed to restore")
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
              rangySerializer.deserializeRange(element.selection).nativeRange
            );
            } catch (error) {
              console.log("Failed to restore")
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

    //Highlight everything
    even = (even + 1) % 2;

    let tooltip = document.createElement('span');
    tooltip.className = 'tool_tip';

    document.body.appendChild(tooltip);

    let isToolTipVisible = false;
    let lastSelection = null;
    let lastSelectionObj = null;
    var markerEl = null;

    render(<ToolComponent>aa</ToolComponent>, tooltip);
    tooltip.style.position = 'absolute';
    tooltip.style.visibility = 'hidden';
    tooltip.style.display = 'none';

    const renderToolTip = (mouseX, mouseY, selection) => {
      mouseX = mouseX - 50;
      mouseY = mouseY - 40;
      if (selection.length < 60) {
        mouseX = mouseX - 20;
      }
      tooltip.style.top = mouseY + 'px';
      tooltip.style.left = mouseX + 'px';
      tooltip.style.visibility = 'visible';
      tooltip.style.display = 'block';
      isToolTipVisible = true;
    };

    const closeToolTip = () => {
      tooltip.style.visibility = 'hidden';
      tooltip.style.display = 'none';
      isToolTipVisible = false;
      clearSelection();
    };

    function clearSelection() {
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      } else if (document.selection) {
        document.selection.empty();
      }
    }

    var startX = 0;
    var endX = 0;
    var startY = 0;
    var endY = 0;

    function hasSomeParentTheClass(element, classname) {
      if (
        typeof element.className === 'undefined' ||
        typeof element.className.split === 'undefined'
      )
        return false;
      if (element.className.split(' ').indexOf(classname) >= 0) return true;
      return (
        element.parentNode &&
        hasSomeParentTheClass(element.parentNode, classname)
      );
    }
    //Close the tool tip
    document.addEventListener('mousedown', (e) => {
      const parentClassName = e.target.parentNode.getAttribute('class');
      const parentIdName = e.target.parentNode.getAttribute('id');
      console.log('Parent Class:', parentClassName);
      console.log('Parent ID:', parentIdName);
      /*
        ISSUE 1: Need more testing on more pages to see if the tooltip properly disappears
        You can double click to "remove" a selection, but the tooltip is still visible need to workout cases
        
        Albeit this one may be a very simple fix
        Share findings if anyone can.
      */

      //Make the tool tip invisible
      if (isToolTipVisible) {
        e.stopPropagation();
        return false;
      }
      if (
        !e.target ||
        !e.target.parentNode ||
        hasSomeParentTheClass(e.target.parentNode, 'bordered-container')
      ) {
        e.stopPropagation();
        showTooltip = false;
        return false;
      }

      showTooltip = true;
      startX = e.pageX;
      startY = e.pageY;
      closeToolTip();
    });
    // Show the tool tip
    document.addEventListener('mouseup', (e) => {
      if (!showTooltip) return false;
      let temp = window.getSelection();
      let selection = temp.toString();
      if (!temp.baseNode || !temp.focusNode) {
        e.stopPropagation();
        showTooltip = false;
        return false;
      }
      let comp =
        temp.baseNode == temp.focusNode ||
        temp.baseNode.parentNode == temp.focusNode.parentNode ||
        temp.baseNode.parentNode == temp.focusNode.parentNode.parentElement;

      console.log('Can tooltip render for selection:', comp);

      if (!comp || (selection == lastSelection && isToolTipVisible)) {
        console.log('I dont want to render at all');
        e.stopPropagation();
        return false;
      } else if (selection.length > 0) {
        console.log('Rendering the tooltip');
        //Render the tooltip
        endX = e.pageX;
        endY = e.pageY;
        console.log('start x is ', startY);
        console.log('end x is ', endY);

        const realStartX = Math.min(startX, endX);
        const realendX = Math.max(startX, endX);

        const realStartY = Math.min(startY, endY);
        const realEndY = Math.max(startY, endY);
        lastSelection = selection;
        lastSelectionObj = window.getSelection();
        renderToolTip(
          (realendX - realStartX) / 2 + realStartX,
          realStartY - (realEndY - realStartY) / 2,
          selection
        );
      } else {
        showTooltip = false;
        closeToolTip();
      }
    });

    //Highlight options
    document.addEventListener('click', (e) => {
      const parentIdName = e.target.parentNode.getAttribute('id');
      const currentID = e.target.getAttribute('id');
      const range =
        lastSelectionObj != null ? lastSelectionObj.getRangeAt(0) : null;
      console.log('Range object:', range);

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
      console.log('Serialized range:', payload.highlightSelection);
      if (parentIdName == 'highlight' || currentID == 'highlight') {
        payload.highlight_type = 'highlights';
        axios
          .post('http://localhost:4000/api/websites/addHighlights', payload)
          .then((res) => {
            console.log(res);
          });
        highlightText('#ffc107', range);
        closeToolTip();
      } else if (parentIdName == 'smile' || currentID == 'smile') {
        payload.highlight_type = 'smiles';
        axios
          .post('http://localhost:4000/api/websites/addHighlights', payload)
          .then((res) => {
            console.log(res);
          });
        highlightText('#28a745', range);
        closeToolTip();
      } else if (parentIdName == 'frown' || currentID == 'frown') {
        payload.highlight_type = 'frowns';
        axios
          .post('http://localhost:4000/api/websites/addHighlights', payload)
          .then((res) => {
            console.log(res);
          });
        highlightText('#dc3545', range);
        closeToolTip();
      } else if (parentIdName == 'comment' || currentID == 'comment') {
        highlightText('#dc3545', range, true);
        console.log('CREATING COMMENT');
        const comment = document.createElement('div');
        console.log(selectionY);
        render(
          <Comment
            startY={selectionY}
            selectionText={range.toString()}
          ></Comment>,
          comment
        );
        document.body.appendChild(comment);

        //Youssef's comment
        closeToolTip();
      } else if (parentIdName == 'note' || currentID == 'note') {
        // API call
        highlightText('blue', range, true);
        closeToolTip();
      }
    });
  }
}
const highlightText = (color, range, underline = false) => {
  var mark = document.createElement('span');
  if (underline) {
    console.log('UNDERLINING');
    mark = document.createElement('u');
    mark.style.textDecoration = 'underline';
    mark.style.textDecorationColor = color;
    mark.style.textDecorationThickness = '.2rem';
    mark.style.textDecorationSkipInk = 'none';
  } else {
    mark.style.backgroundColor = color;
   // mark.style.textDecoration = 'none';
  }

  /*
  ISSUE 4:
    Need a check if the common ancestor of the range is a mark.
    Ideally, we should "overwrite" the existing highlight with the newer one
    

    Need checks for nested highlights
    As of now, if you "update" (highlight a highlight) a highlight - the mark doesn't get update but instead a new mark tag gets nested in it

    RIght now, im suspecting the extractContents as the culprit because it's extract the contents of the range
    If the range has a mark it'll just add the mark to the newly created mark

    For more reference of the Range API checkout: https://developer.mozilla.org/en-US/docs/Web/API/Range
  */

  mark.appendChild(range.extractContents()); //Append the contents of the selection's range to our mark tag
  mark.normalize();
  console.log('Mark element:', mark);
  range.deleteContents(); // Not sure if this is necessary, but just in case I'm removing the rangeContents to make sure no extra elements
  range.insertNode(mark); // Insert mark into the range
  console.log('Range after highlight:', range);
};
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
