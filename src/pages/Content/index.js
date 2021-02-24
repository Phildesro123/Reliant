import React from 'react';
import { render } from 'react-dom';
import StarRating from './modules/Questionnaire';
import { URLS } from "../Background/workingUrls";


console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');
document.querySelector('div').addEventListener('selectionchange', () => {
  console.log('Selection updated');
});

async function getHostname() {
  return new Promise(resolve => {
    chrome.runtime.sendMessage("currentHost", (hostname) => {
      resolve(hostname);
    });
  })
}


async function createQuestionnaire(hostname) {
  console.log("Creating Questionare for", hostname)
  var contentBody = null;
  if (hostname == URLS.WIRED) {
    console.log("We're on WIRED")
    contentBody = document.getElementsByClassName("article main-content")[0];
  } else if (hostname == URLS.CNN) {
    console.log("We're on CNN")
    contentBody = document.getElementById("body-text");
  } else if (hostname == URLS.VERGE) {
    console.log("We're on Verge")
    contentBody = document.getElementsByClassName("c-entry-content ")[0];
  } else if (hostname == URLS.VOX) {
    console.log("We're on Vox")
    contentBody = document.getElementsByClassName("c-entry-content ")[0];
  } else if (hostname == URLS.FOXNEWS) {
    console.log("We're on Fox")
    contentBody = document.getElementsByClassName("article-body")[0];
  } else if (hostname == URLS.MEDIUM) {
    console.log("We're on Medium")
    contentBody = document.getElementsByClassName("meteredContent")[0];
  } else if (hostname == URLS.NYTIMES) {
    console.log("We're on NY Times")
    contentBody = document.getElementsByClassName("bottom-of-article")[0];
  }
  const questionnaire = document.createElement('div');
  contentBody.appendChild(questionnaire);
  render(<StarRating/>, questionnaire);
}

export async function getUserInfo() {
  return new Promise(resolve => {
    chrome.runtime.sendMessage("userInfo", (userInfo) => {
      resolve(userInfo)
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

async function activateReliant() {
  var first = true;
  var colors = []; // Array holding paragraph colors in the form [original, random]
  var even = 0; // 0 --> Original Color, 1 --> Random Color
  const hostname = await getHostname()
  
  //Check if hostname is in URLS
  var foundURL = false
  for (const key in URLS) {
    if (hostname == URLS[key]) {
      foundURL = true;
      break;
    }
  }
  if (!foundURL) {
    console.log("UNSUPPORTED WEBSITE")
    return
  }

  createQuestionnaire(hostname);

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
  const userInfo = await getUserInfo()
  console.log("Email:", userInfo.email, "ID:", userInfo.id, "Questionnaire avg:", score)
}





//Will clean this up later
chrome.runtime.onMessage.addListener((req, send, sendResponse) => {
  if (req.type === 'injectReact') {
   //Do nt
  } else {
    activateReliant()
  }
});