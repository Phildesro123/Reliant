import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';

import { URLS } from '../Background/workingUrls';
import Questionnaire from './modules/Questionnaire-Component';
var readingTime = require('reading-time');
const questionnaire = document.createElement('div');
var timeOpened = new Date().getTime();
export function createQuestionnaire(userId, url, hostname) {
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
      const articles = document.getElementsByTagName('article');
      if (articles.length > 0) {
        contentBody = articles[articles.length - 1];
      } else {
        contentBody = document.querySelector('body');
      }
    }
    contentBody.appendChild(questionnaire);
    console.log('Content Body', contentBody);
    render(
      <Questionnaire userId={userId} url={url} genre={genre} />,
      questionnaire
    );
  }

  export function removeQuestionnaire() {
      comment.remove();
      questionnaire.remove();
  }

  function timeAdjustment(documentObj) {
    if (typeof documentObj == 'undefined') {
      console.log('bad document');
      return 1;
    }
    let paragraphs = documentObj.getElementsByTagName('p');
    var overall = '';
    for (const paragraph of paragraphs) {
      //Basic way to filter out title or unrelated content.
      if (paragraph.textContent.length > 100) {
        overall = overall + paragraph.textContent;
      }
    }
    let expectedTime = readingTime(overall).minutes * 60;
    console.log("expected," , expectedTime);
    return expectedTime;
  }
  export async function submitQuestionnaire(userId, url, score) {
    //Logic for submitting questionarre
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
  
    
    let timeRightNow = new Date().getTime();
    let seconds = Math.floor((timeRightNow - timeOpened) / 1000);
    console.log(seconds);
    let timeNeeded = timeAdjustment(document);
    await axios.post('http://localhost:4000/api/user/updateSites',{
      _id: userId,
      website: {
        _id: url,
        timespent: seconds,
      }
    })
      .then((res) => {
        console.log('Data has been sent to the server');
        timeOpened = timeRightNow;
      })
      .catch(() => {
        console.log('Internal server error');
      });
      await axios.post('http://localhost:4000/api/reviews/addReview', {
        _id: {
          userId: userId,
          url: url,
        },
        results: results,
        overallScore: overallScore,
        timeNeeded: timeNeeded
      }).then((res) => {
        console.log(res);
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