const readingTime = require('reading-time');
const minTime = 10;
const commentIncrease = 1.25;
const defaultWeight = 1;
const percentOfExpected = 0.4;
import axios from 'axios';
import { TabPane } from 'react-bootstrap';


//Used to see how long the user has been on the webpage
//Input = date.time that the webpage was opened (does not work for current schema)
function durationCheck(userInfo, timeOpened) {
    let now = new Date().getTime()
    //ADD PREVIOUS TIME SPENT USING USERINFO
    return (now - timeOpened)/1000;
}
//may need to send messages to index
function weightCalculation(userInfo, timeOpened, documentObj) {
  /* Eliminate reviews from user who spent less than 10 seconds on the article.
  Requires input timeOpened (int), based on  */
  if (durationCheck(timeOpened) <= minTime) {
    return 0;
  }
  let weight = defaultWeight;
  weight = timeAdjustment(userInfo, timeOpened, documentObj) * weight;
  if (/*user.commented*/true) {
    weight = commentIncrease * weight;
  }
  return weight;
}

/* actual implementation depends on how it's stored
*/
export function calculateScore(url, questionAnswers, userInfo, timeOpened, documentObj) {
  console.log(documentObj);
  var score = 0;
  var totalWeight = 0;
  var failed = false;
  var reviews;
  var website;
  //The goal of this request is to get the Website object the reviews into the variable reviews
  axios.get('http://localhost:4000/api/websites/getSiteData', {params: {
    _id: url
  }}).then((response) => {
    website = response;
    reviews = response.reviews;
    console.log("got review data from " + url);
  }).catch((error) => {
    console.log(error);
    console.log("oops");
    failed = true;
  })
  if (failed) {
    return;
  }
 /*TEST DATA
  questionAnswers = {score: 1}
  userInfo = {id: '666'};
  timeOpened = new Date().getTime();
  reviews = [{userId: '232032934', score: 4, weight: 1.5}, {userId: '25632934', score: 1, weight: .25}, {userId: '2123', score: 5, weight: 1}]
  console.log("REVIEWS BELOW");
  console.log(reviews);
  website = {reviews: reviews};
  END OF TEST DATA */
  var replacedUserReview = false;
  if (typeof(reviews) == "undefined") {
    reviews = [];
  }
  if (reviews.length > 0) {
    reviews.forEach((element, index) => {
      //the goal of this if statement is to see if the owner of the review is the current user
      if (element.userId === userInfo.id) {
        replacedUserReview = true;
        //replace it
        reviews[index] = {
          userId: userInfo.id,
          score: questionAnswers.score, // Go through questions by weight
          weight : weightCalculation(userInfo, timeOpened, documentObj) //input types do not currently match
        }
      }
    });
  }
  if (!replacedUserReview) {
    reviews.push({
      userId : userInfo.id,
      score: questionAnswers.score, // Go through questions by weight
      weight : weightCalculation(userInfo, timeOpened, documentObj) //input types do not currently match
    });
    console.log("appended new review to array");
  }
  reviews.forEach(element => {
    score = score + (element.score * element.weight);
    totalWeight = totalWeight + element.weight;
  })
  website.reviews = reviews; //Update list of reviews
  console.log(reviews);
  const payload2 = {
    _id: url,
    website: website
  }
  //THE GOAL OF THIS POST IS TO UPDATE THE WEBSITE OBJECT IN THE DAtABASE
  axios.post('localhost:4000/getSiteData', payload2).then((response)=> {
    console.log("Successfully updated reviews");
  }).catch(error => {
    console.log("Could not update reviews")
  });
  console.log((score/totalWeight));
  return (score / totalWeight);
}


//https://moinism.medium.com/page-scroll-progress-with-javascript-34f5a5073722
function progressAnalysis(progress) {
  //progress - array of scrollbar progress (0-100%) ie. [0, 2, 18, 54, 71, 100] or array of time-value tuples (x,y), x = time since opening, y = progress
  return 0;
}

/* Weights users that read article for less than a minute in a linear relationshio.
Can be updated to account for reading time (my guess is 80% for full weight)
https://github.com/michael-lynch/reading-time
https://github.com/ngryman/reading-time - could be used over all <p>
*/
function timeAdjustment(userInfo, timeOpened, documentObj) {
    if (typeof(documentObj) == 'undefined') {
      console.log("bad document");
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
    let expectedTime = readingTime(overall).minutes*60;
    console.log("Expected Reading Time : " + expectedTime);
    if (expectedTime == 0) {
        return 1;
    }
    let actualTime = durationCheck(userInfo, timeOpened);
    console.log("Time read: " + actualTime);
    return Math.min(1, (1/(percentOfExpected* expectedTime)) * actualTime);
}