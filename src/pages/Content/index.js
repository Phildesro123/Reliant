import { printLine } from './modules/print';
import React from 'react';
import { render } from 'react-dom';
import StarRating from './modules/Questionnaire';
import { resolveModuleName } from 'typescript';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');
document.querySelector('div').addEventListener('selectionchange', () => {
  console.log('Selection updated');
});


export async function getUserInfo() {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({}, (userInfo) => {
      resolve(userInfo)
    });
  });
}

export async function submitQuestionnaire() {
  //Logic for submitting questionarre
  const userInfo = await getUserInfo()
  console.log("Email:", userInfo.email, "ID:", userInfo.id)
}


function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
var first = true;
var colors = []; // Array holding paragraph colors in the form [original, random]
var even = 0; // 0 --> Original Color, 1 --> Random Color

//Will clean this up later
chrome.runtime.onMessage.addListener((req, send, sendResponse) => {
  if (req.type === 'injectReact') {
   //Do nt
  } else {
    const contentBody = document.body;
    const questionnaire = document.createElement('div');
    contentBody.appendChild(questionnaire);
    render(<StarRating/>, questionnaire);
    console.log('I WILL INJECT THE REEACT');
    even = (even + 1) % 2;
    console.log(
      send.tab ? 'from a content script:' + send.tab.url : 'from the extension'
    );
    let paragraphs = document.getElementsByTagName('p');
    console.log(paragraphs);
    var i = 0;
    console.log(colors);
    for (const paragraph of paragraphs) {
      //console.log(paragraph.textContent)
      if (first) {
        colors.push([paragraph.style['background-color'], getRandomColor()]);
        console.log(colors[i]);
        paragraph.style['background-color'] = colors[i][1];
      } else {
        paragraph.style['background-color'] = colors[i][even];
      }
      i++;
    }
    first = false;
    sendResponse({ message: 'ACK' });
  }
});
printLine("Using the 'printLine' function from the Print Module");
/*let paragraphs = document.getElementsByTagName('p');
//console.log(paragraphs)
for (const paragraph of paragraphs) {
    //console.log(paragraph.textContent)
    paragraph.style['background-color'] = getRandomColor();
}
*/
