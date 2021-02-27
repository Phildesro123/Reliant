import React from 'react';
import { render } from 'react-dom';
import StarRating from './modules/Questionnaire';
import { URLS } from '../Background/workingUrls';
import axios from 'axios';
import {calculateScore} from '../../containers/Score/Score';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');
document.querySelector('div').addEventListener('selectionchange', () => {
  console.log('Selection updated');
});


export async function getURL() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage("activeURL", (url) => {
      resolve(url);
    });
  });
}

async function createQuestionnaire(hostname) {
  console.log('Creating Questionare for', hostname);
  var contentBody = null;
  if (hostname == URLS.WIRED) {
    console.log("We're on WIRED");
    contentBody = document.getElementsByClassName('article main-content')[0];
  } else if (hostname == URLS.CNN) {
    console.log("We're on CNN");
    contentBody = document.getElementById('body-text');
  } else if (hostname == URLS.VERGE) {
    console.log("We're on Verge");
    contentBody = document.getElementsByClassName('c-entry-content ')[0];
  } else if (hostname == URLS.VOX) {
    console.log("We're on Vox");
    contentBody = document.getElementsByClassName('c-entry-content ')[0];
  } else if (hostname == URLS.FOXNEWS) {
    console.log("We're on Fox");
    contentBody = document.getElementsByClassName('article-body')[0];
  } else if (hostname == URLS.MEDIUM) {
    console.log("We're on Medium");
    contentBody = document.getElementsByClassName('meteredContent')[0];
  } else if (hostname == URLS.NYTIMES) {
    console.log("We're on NY Times");
    contentBody = document.getElementsByClassName('bottom-of-article')[0];
  }
  const questionnaire = document.createElement('div');
  contentBody.appendChild(questionnaire);
  render(<StarRating />, questionnaire);
}

export async function getUserInfo() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage('userInfo', (userInfo) => {
      resolve(userInfo);
    });
  });
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

var first = true; //Used to ensure the questionnaire can only be injected once.
var loaded = false;
var colors = []; // Array holding paragraph colors in the form [original, random]
var even = 0; // 0 --> Original Color, 1 --> Random Color
window.onload = function() {
  loaded = true;
  console.log("LOADED");
}
var timeOpened = new Date().getTime()

async function activateReliant() {
  if (!loaded) {
    console.log("page not loaded")
    return; // Prevents Reliant from being activated if the site is not done loading.
  }
  console.log("activated reliant")
  const url = new URL(await getURL());
  const userInfo = await getUserInfo();
  const hostname = url.hostname;

  const payload = {
    _id: userInfo.id,
    website: {
      _id: url,
      timespent: 5
    }
  }
  
  console.log("Adding Website to",userInfo.email, "visited list.")
  axios({
    url: 'http://localhost:4000/api/user/updateSites',
    method: 'POST',
    data: payload
  }).then(() => {
    console.log("Data has been sent to the server")
  })
  .catch(() => {
    console.log("Internal server error")
  });

  const sitePayload = {
    _id: url,
  }
  axios({
    url: "http://localhost:4000/api/websites",
    method: "POST",
    data: sitePayload
  })
  
  //Check if hostname is in URLS
  var foundURL = false;
  for (const key in URLS) {
    if (hostname == URLS[key]) {
      foundURL = true;
      break;
    }
  }
  if (!foundURL) {
    console.log('UNSUPPORTED WEBSITE');
    return;
  }
  if (first) {
    createQuestionnaire(hostname);
  }

  //Highlight everything
  even = (even + 1) % 2;
  let paragraphs = document.getElementsByTagName('p');
  var i = 0;
  for (const paragraph of paragraphs) {
    //console.log(paragraph.textContent)
    if (first) {
      colors.push([paragraph.style['background-color'], getRandomColor()]);
      paragraph.style['background-color'] = colors[i][1];
    } else {
      paragraph.style['background-color'] = colors[i][even];
    }
    i++;
  }
  first = false;
}

export async function submitQuestionnaire(score) {
  //Logic for submitting questionarre
  const userInfo = await getUserInfo();
  const url = await getURL();
  const payload = {
    _id: url,
    reliabilityScore: score
  }
  // //TODO: Implement the two push calls below which save the review to the reviews collection and update the reliability score
  // axios.push("http://localhost:4000/api/reviews", {
  //   _id: {userId: userInfo.id,
  //         url: url},
  //   reviews: [
  //     questionId: questionId
  //     score: score
  //   ]
  // }).then(() => {
  //   axios.push("http://localhost:4000/api/websites/updateScore", {
  //     // TODO: update score with score logic
  //   })
  // })
  await calculateScore(url, score, userInfo, timeOpened, document);
}

//Runs when activate is pressed from Popup
chrome.runtime.onMessage.addListener((req, send, sendResponse) => {
  if (req.type === 'injectReact') {
    //Do nt
  } else if(req.type === 'activate') {
    activateReliant();
  }
});
