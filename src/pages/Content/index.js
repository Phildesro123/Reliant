import React from 'react';
import { render } from 'react-dom';
import Questionnaire from './modules/Questionnaire';
import Highlight from './modules/HighlightScript';
import { URLS } from '../Background/workingUrls';
import axios from 'axios';
import { calculateScore } from '../../containers/Score/Score';
import ToolComponent from './modules/Tooltip';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');
document.querySelector('div').addEventListener('selectionchange', () => {
  console.log('Selection updated');
});

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
  var genre = '';
  if (hostname.includes(URLS.WIRED)) {
    console.log("We're on WIRED");
    contentBody = document.getElementsByClassName('article main-content')[0];
    genre = 'Tech';
  } else if (hostname.includes(URLS.CNN)) {
    console.log("We're on CNN");
    contentBody = document.getElementById('body-text');
    genre = 'Political';
  } else if (hostname.includes(URLS.VERGE)) {
    console.log("We're on Verge");
    contentBody = document.getElementsByClassName('c-entry-content ')[0];
    genre = 'Tech';
  } else if (hostname.includes(URLS.VOX)) {
    console.log("We're on Vox");
    contentBody = document.getElementsByClassName('c-entry-content ')[0];
    genre = 'Political';
  } else if (hostname.includes(URLS.FOXNEWS)) {
    console.log("We're on Fox");
    contentBody = document.getElementsByClassName('article-body')[0];
  } else if (hostname.includes(URLS.MEDIUM)) {
    console.log("We're on Medium");
    contentBody = document.getElementsByTagName('article')[0];
    genre = 'Education';
  } else if (hostname.includes(URLS.NYTIMES)) {
    console.log("We're on NY Times");
    contentBody = document.getElementsByClassName('bottom-of-article')[0];
    genre = 'Political';
  }
  if (contentBody == undefined) {
    contentBody = document.body;
  }
  const questionnaire = document.createElement('div');
  contentBody.appendChild(questionnaire);
  render(
    <Questionnaire userId={userId} url={url} genre={genre} />,
    questionnaire
  );
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
window.onload = function () {
  loaded = true;
  console.log('LOADED');
};
var timeOpened = new Date().getTime();

async function activateReliant() {
  if (!loaded) {
    console.log('page not loaded');
    return; // Prevents Reliant from being activated if the site is not done loading.
  }
  console.log('activated reliant');
  const url = await getURL();
  const userInfo = await getUserInfo();
  const hostname = new URL(url).hostname;

  //Check if hostname is in URLS
  var foundURL = false;
  for (const key in URLS) {
    if (hostname.includes(URLS[key])) {
      foundURL = true;
      break;
    }
  }
  if (!foundURL) {
    console.log('UNSUPPORTED WEBSITE');
    return;
  }

  axios
    .post('http://localhost:4000/api/user/updateSites', {
      _id: userInfo.id,
      website: {
        _id: url,
        timespent: 5,
      },
    })
    .then(() => {
      console.log('Data has been sent to the server');
    })
    .catch(() => {
      console.log('Internal server error');
    });

  axios
    .post('http://localhost:4000/api/websites/addSite', {
      _id: url,
    })
    .then((response) => {
      console.log(response);
    })
    .catch(() => {
      console.log('Internal server error');
    });

  if (first) {
    createQuestionnaire(userInfo.id, url, hostname);
  }

  //Highlight everything
  even = (even + 1) % 2;

  var createReactClass = require('create-react-class');
  let tooltip = document.createElement('span');
  tooltip.className = 'tool_tip';
  document.body.appendChild(tooltip);
  render(<ToolComponent>aa</ToolComponent>, tooltip);
  tooltip.style.position = 'absolute';
  tooltip.style.visibility = 'hidden';
  // tooltip.style.display = 'none';


  const renderToolTip = (mouseX, mouseY, selection) => {
    mouseX = mouseX - 50;
    mouseY = mouseY - 25;
    tooltip.style.top = mouseY + 'px';
    tooltip.style.left = mouseX + 'px';
    tooltip.style.visibility = 'visible';
    tooltip.style.display = 'block';

  };

  var startX = 0;
  var endX = 0;
  //Close the tool tip
  document.addEventListener('mousedown', (e)=> {    
    //Make the tool tip invisible
    //console.log(e);
    if (e.target.parentNode.getAttribute('class') == 'tool_tip' || e.target.getAttribute('class') == "btn btn-primary") {
      
      e.stopPropagation();
    } else {
      startX = e.pageX
      
    tooltip.style.display = 'hidden'
    tooltip.style.display = 'none'
  }
  })
  // Show the tool tip
  let paragraphs = document.getElementsByTagName('p');
  document.addEventListener('mouseup', (e)=> {
    let selection = window.getSelection().toString();
    if (selection.length > 0) {
      //Render the tooltip
      
      endX = e.pageX
      console.log("start x is ", startX)
      console.log("end x is ", endX)
      renderToolTip((endX - startX)/2 + startX, e.pageY, selection)
    }
  })




  
  //paragraphs = Array.from(paragraphs);
  // render(<Highlight children={paragraphs}/>, paragraphs);
 // console.log(paragraphs);
//  console.log('before highlightpop', paragraphs[0]);
  // grab the 0th indx para
  // grab teh last indx parag

  // div called big div
  // bigdiv.appendBefore 0th index paragraph
  // bigdiv.append lastindex pargarph

/*   let highlightWrapper = document.createElement('span');
  highlightWrapper.id = 'highlight_tool';

  const firstParagarph = paragraphs[0];
  const contentBody = document.getElementsByClassName('c-entry-content ')[0];
  contentBody.appendChild(highlightWrapper);
  highlightWrapper.appendChild(firstParagarph);
  console.log(highlightWrapper);

  const last = paragraphs[paragraphs.length - 1];
  console.log('before wrapping');
  //firstParagarph.parentNode.replaceChild(highlightWrapper, firstParagarph);

  highlightWrapper.parentNode.appendChild(firstParagarph);

  render(
    <HighlightPop onHighlightPop={() => console.log('Highlighting')}>
      <p>Hello, this is a testing tag</p>
    </HighlightPop>,
    highlightWrapper
  ); */
  console.log('after wrapping');
  //   for (const paragraph of paragraphs) {
  //     // console.log(paragraph.textContent)
  //     // if (first) {
  //     //   colors.push([paragraph.style['background-color'], getRandomColor()]);
  //     //   paragraph.style['background-color'] = colors[i][1];
  //     // } else {
  //     //   paragraph.style['background-color'] = colors[i][even];
  //     // }
  //     const highlightWrapper = document.createElement('div');

  //     //console.log(paragraph);
  //     //paragraph.parentNode.insertBefore(highlight, paragraph);
  //     console.log(
  //       '==== Highlight react component should be wrapped at this point ===='
  //     );
  //     paragraph.parentNode.replaceChild(highlightWrapper, paragraph);

  //     highlightWrapper.appendChild(paragraph);

  //     render(
  //       <HighlightPop onHighlightPop={() => console.log('Highlighting')} />,
  //       highlightWrapper
  //     );
  //   }
  //   first = false;
}

export async function submitQuestionnaire(score) {
  //Logic for submitting questionarre
  const userInfo = await getUserInfo();
  const url = await getURL();
  //create/update review
  var results = [];
  var overallScore = 0;
  for (const s in score) {
    overallScore += score[s].score;
    results.push({
      _id: s,
      response: score[s].score,
    });
  }
  overallScore /= Object.keys(score).length;

  await axios
    .post('http://localhost:4000/api/reviews/addReview', {
      _id: {
        userId: userInfo.id,
        url: url,
      },
      results: results,
      overallScore: overallScore,
    })
    .then((res) => {
      console.log('Successfully saved review');
    })
    .catch((err) => {
      console.log('Error from addReview:', err);
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
  if (req.type === 'injectReact') {
    //Do nt
  } else if (req.type === 'activate') {
    activateReliant();
  }
});
