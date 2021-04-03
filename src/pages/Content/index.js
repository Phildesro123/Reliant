import React from 'react';
import { render } from 'react-dom';
import Questionnaire from './Questionnaire';
import Comment from './modules/Comment-Container';
import CommentScroll from './modules/Comment-Scroll';
import { URLS } from '../Background/workingUrls';
import axios from 'axios';
import { calculateScore } from '../../containers/Score/Score';
import {createTooltip, removeTooltip} from './modules/Tooltip-Component';
import {createQuestionnaire, removeQuestionnaire}  from './Questionnaire'
import {authorName} from './authorName'
import {FaComment} from 'react-icons/fa'


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

  axios.get("http://localhost:4000/api/websites/getUserHighlights", {params: {
    url: currentURL,
    userID: currentUserInfo.id
  }}).then((res) => {
    for(highlightObj in res) {
      console.log("Highlight from DB:", highlightObj.highlightSelection)
      highlightText('#ffc107', highlightObj.highlightSelection);
    }
  }).catch((err) => {
    console.log('Internal server error in getUserHighlights:', err);
  });

  if (first) {
    createQuestionnaire(currentUserInfo.id, currentURL, currentHostname);
    const commentScroll = document.createElement('div')
    commentScroll.className = "comment-scroll"
    render(<CommentScroll ref={(cs) => {window.commentScroll = cs}}></CommentScroll>, commentScroll)
    console.log("Window", window)
    console.log("Window.commentScroll", window.commentScroll)
    document.body.appendChild(commentScroll)
    //Highlight everything
    even = (even + 1) % 2;


    function clearSelection() {
      if (window.getSelection) {window.getSelection().removeAllRanges();}
      else if (document.selectionText) {document.selectionText.empty();}
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


    document.addEventListener('mousedown', (e) => {
      console.log("MOUSE DOWN")
      console.log("e:", e)
      console.log("e.target.ParentNode", e.target.parentNode)
      mouseDownX = e.pageX;
      showTooltip = true;
      // remove all selected css styles when you click anywher on the screen
      Array.prototype.forEach.call(document.getElementsByClassName("reliant-selected"), (element) => {
        element.classList.remove("reliant-selected");
      })
      
      tooltipClicked = false;
      if (hasSomeParentTheClass(e.target.parentNode, "reliant-tooltip")) {
        console.log("Tooltip clicked")
        tooltipClicked = true;
      } else {
        removeTooltip();
      }

      if (!e.target || !e.target.parentNode || hasSomeParentTheClass(e.target.parentNode, 'bordered-container')) {
        console.log("Clicked inside comment, showTooltip is now false")
        e.stopPropagation();
        showTooltip = false;
        return false;}
    });

    // Show the tool tip
    document.addEventListener('mouseup', (e) => {
      console.log("MOUSE UP")
      if (tooltipClicked || !showTooltip) return false;
      console.log("Executing mouse up commands")
      let selection = window.getSelection();
      let selectionText = selection.toString();
      console.log("Selection", selection);


      // Triggers when multi paragraph selection occurs
      if (!(selection.baseNode == selection.focusNode || selection.baseNode.parentNode == selection.focusNode.parentNode)) {
        console.log("Please dont select multiple paragraphs")
        removeTooltip();
        clearSelection();
        return false;
      }
      
      if (selectionText.length > 0) {
        //Render the tooltip
        range = selection.getRangeAt(0)
        const boundingBox = range.getBoundingClientRect();
        const selectionCenterX = (mouseDownX + boundingBox.right) / 2
        selectionTopY = boundingBox.y + window.pageYOffset;
        createTooltip(selectionCenterX, selectionTopY)

        // lastSelection = selectionText;
        // lastSelectionObj = selection;
      } else {
        showTooltip = false;
        removeTooltip();
      }
    });

    //Highlight options
    document.addEventListener('click', (e) => {
      console.log("CLICK")
      console.log("Clicked in tooltip", tooltipClicked)
      if (!tooltipClicked) return false;
      clearSelection()
      const parentIdName = e.target.parentNode.getAttribute('id');
      const currentID = e.target.getAttribute('id');
      var id = null;
      const payload = {
        url: currentURL,
        userID: currentUserInfo.id,
        highlightSelection: range
      }
      if (parentIdName == 'highlight' || currentID == 'highlight') {
        axios.post('http://localhost:4000/api/websites/addHighlights', payload).then((res) => {
          console.log(res);
          highlightText('#ffc107', range, "reliant-highlight");
        })
        removeTooltip();

      } else if (parentIdName == 'smile' || currentID == 'smile') {
        highlightText('#28a745', range, "reliant-smile");
        removeTooltip();
      } else if (parentIdName == 'frown' || currentID == 'frown') {
        highlightText('#dc3545', range, "reliant-frown");
        removeTooltip();
      } else if (parentIdName == 'comment' || currentID == 'comment') {
        id = highlightText('#dc3545', range, "reliant-comment", true);
        window.commentScroll.addCommentContainer(id, range.toString(), selectionTopY, mouseDownX)
        removeTooltip();
      } else if (parentIdName == 'note' || currentID == 'note') {
        highlightText('blue', range, "reliant-note", true);
        // Implement note
        removeTooltip();
      }
    });

    //Fix this, WE SHOULD ONLY MANIPULATE P TAGS
    var selectionTextId = 0
    const highlightText = (color, range, className, underline=false) => {
      var mark = document.createElement('mark')
      if (underline) {
        mark = document.createElement('u');
        mark.style.textDecoration = "underline";
        mark.style.textDecorationColor = color;
        mark.style.textDecorationThickness = ".2rem";
        mark.style.textDecorationSkipInk = "none"
      } else {
        mark.style.backgroundColor = color;
        mark.style.textDecoration = 'none';
      }
      mark.className = className;
      mark.id = selectionTextId;
      mark.onclick = () => {
        mark.className += " reliant-selected"
        window.commentScroll.moveContainer(parseInt(mark.id))
      };
      mark.textContent = range.toString();
      range.deleteContents();
      range.insertNode(mark);
      selectionTextId+=1
      return parseInt(mark.id)
    };
  }
}

function deactivateReliant() {
  ACTIVATED = false;
  console.log('Deactivating Reliant');
  removeQuestionnaire();
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
