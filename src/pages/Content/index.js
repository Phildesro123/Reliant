import React from 'react';
import { render } from 'react-dom';
import Questionnaire from './modules/Questionnaire';
import Comment from './modules/Comment';
import { URLS } from '../Background/workingUrls';
import axios from 'axios';
import { calculateScore } from '../../containers/Score/Score';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

const comment = document.createElement('div')
const questionnaire = document.createElement('div')
var ACTIVATED = false;
var LOADED = false;
var paragraphs = null;

document.querySelector('div').addEventListener('selectionchange', () => {
  console.log('Selection updated');
});

export function getLoadedState() {return LOADED}
export function getActivateState() {return ACTIVATED}

export async function getURL() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage('activeURL', (url) => {
      resolve(url);
    });
  });
}

async function createQuestionnaire(userId, url, hostname) {
  console.log('Creating Questionare for', hostname);
  var contentBody = null;
  var genre = ""
  if (hostname.includes(URLS.WIRED)) {
    console.log("We're on WIRED");
    contentBody = document.getElementsByClassName('article main-content')[0];
    genre = "Tech"
  } else if (hostname.includes(URLS.CNN)) {
    console.log("We're on CNN");
    contentBody = document.getElementById('body-text');
    genre = "Political"
  } else if (hostname.includes(URLS.VERGE)) {
    console.log("We're on Verge");
    contentBody = document.getElementsByClassName('c-entry-content ')[0];
    genre = "Tech"
  } else if (hostname.includes(URLS.VOX)) {
    console.log("We're on Vox");
    contentBody = document.getElementsByClassName('c-entry-content ')[0];
    genre = "Political"
  } else if (hostname.includes(URLS.FOXNEWS)) {
    console.log("We're on Fox");
    contentBody = document.getElementsByClassName('article-body')[0];
  } else if (hostname.includes(URLS.MEDIUM)) {
    console.log("We're on Medium");
    contentBody = document.getElementsByTagName("article")[0];
    genre = "Education"
  } else if (hostname.includes(URLS.NYTIMES)) {
    console.log("We're on NY Times");
    contentBody = document.getElementsByClassName('bottom-of-article')[0];
    genre = "Political"
  }
  if (contentBody == undefined) {
    const articles = document.getElementsByTagName('article');
    if (articles.length > 0) {
      contentBody = articles[articles.length -1]
    } else {
      contentBody = document.querySelector('body');
    }
  }
  contentBody.appendChild(questionnaire);
  contentBody.appendChild(comment);
  console.log("Content Body" , contentBody)
  render(<Comment />, comment)
  render(<Questionnaire userId={userId} url={url} genre={genre} />, questionnaire);
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
var colors = []; // Array holding paragraph colors in the form [original, random]
var even = 0; // 0 --> Original Color, 1 --> Random Color
window.onload = async function () {
  LOADED = true;
  console.log('LOADED');
  const hostname = new URL(await getURL()).hostname;
  console.log(hostname)
  for (const key in URLS) {
    if (hostname.includes(URLS[key])) {
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
  const url = await getURL();
  const userInfo = await getUserInfo();
  const hostname = new URL(url).hostname;

  //Check if hostname is in URLS
  // var foundURL = false;
  // for (const key in URLS) {
  //   if (hostname.includes(URLS[key])) {
  //     foundURL = true;
  //     break;
  //   }
  // }
  // if (!foundURL) {
  //   console.log('UNSUPPORTED WEBSITE');
  //   return;
  // }

  axios.post('http://localhost:4000/api/user/updateSites',{
    _id: userInfo.id,
    website: {
      _id: url,
      timespent: 5
    }
  })
    .then(() => {
      console.log('Data has been sent to the server');
    })
    .catch(() => {
      console.log('Internal server error');
    });

  axios.post("http://localhost:4000/api/websites/addSite",{
    _id: url
    })
    .then((response) => {
      console.log(response);
    })
    .catch(() => {
      console.log('Internal server error');
    });
    createQuestionnaire(userInfo.id, url, hostname);

  //Highlight everything
  paragraphs = document.getElementsByTagName('p');
  var i = 0
  for (const paragraph of paragraphs) {
    //console.log(paragraph.textContent)
    if (first) {
      colors.push([paragraph.style['background-color'], getRandomColor()]);
    }
    paragraph.style['background-color'] = colors[i][1];
    i++;
  }
  first = false;
}

function deactivateReliant() {
  ACTIVATED = false;
  console.log("Deactivating Reliant")
  comment.remove();
  questionnaire.remove();
  var i = 0
  for (const paragraph of paragraphs) {
    paragraph.style['background-color'] = colors[i][0];
    i++;
  }
}

export async function submitQuestionnaire(score) {
  //Logic for submitting questionarre
  const userInfo = await getUserInfo();
  const url = await getURL();
  //create/update review
  var results = [];
  var overallScore = 0
  for (const s in score) {
    overallScore += score[s].score;
    results.push({
      _id: s,
      response: score[s].score,
    });
  }
  overallScore /= Object.keys(score).length

  await axios.post('http://localhost:4000/api/reviews/addReview', {
    _id: {
      userId: userInfo.id,
      url: url,
    },
    results: results,
    overallScore: overallScore 
  }).then((res) => {
    console.log("Successfully saved review")
  }).catch((err) => {
    console.log("Error from addReview:", err)
    throw err;
  });
  //TODO: Implement the two push calls below which save the review to the reviews collection and update the reliability score
  // axios
  //   .push('http://localhost:4000/api/reviews', {
  //     _id: { userId: userInfo.id, url: url },
  //   })
  // })
  /* Necessary Inputs:
  oldWebsiteScore = reliability score of url from the database (default 0)
  oldWebsiteWeight = number of reviews of url (default 0 ) -- this accounts for review weights
  oldUserScore = rating of review made by same user on same website earlier (0 if first time)
  oldUserWeight = calculated weight made from previous review (0 if first time)
  totalTimeOpened = number of seconds article has been read (stored time + current session time)
  newUserScore = the score given by the user by the current questionnaire
  document = document of HTML, already good as-is
  Outputs:
  r[0] = new reliability score of url
  r[1] = new total weight of url (number of reviews)
  r[2] = userScore
  r[3] = userWeight --> r[2], r[3] used to store in Reviews
  */
  // calculateScore(
  //   oldWebsiteScore,
  //   oldWebsiteWeight,
  //   oldUserScore,
  //   oldUserWeight,
  //   totalTimeOpened,
  //   newUserScore,
  //   documentObj
  // );
}

//Runs when activate is pressed from Popup
chrome.runtime.onMessage.addListener((req, send, sendResponse) => {
  if (req.type === 'activate') {
    activateReliant();
  } else if (req.type === 'deactivate') {
    deactivateReliant();
  }
});
