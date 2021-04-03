const readingTime = require('reading-time');
const minTime = 10;
const commentIncrease = 1.25;
const defaultWeight = 1;
const PERCENTOFEXPECTED = 0.4;
//import axios from 'axios';
//import { TabPane } from 'react-bootstrap';

//Used to see how long the user has been on the webpage
//Input = date.time that the webpage was opened (does not work for current schema)
function durationCheck(timeOpened) {
  let now = new Date().getTime();
  //ADD PREVIOUS TIME SPENT USING USERINFO
  return (now - timeOpened) / 1000;
}
//may need to send messages to index
function weightCalculation(totalTimeOpened, documentObj) {
  /* Eliminate reviews from user who spent less than 10 seconds on the article.
  Requires input timeOpened (int), based on  */
  if (totalTimeOpened <= minTime) {
    return 0;
  }
  let weight = defaultWeight;
  weight = timeAdjustment(totalTimeOpened, documentObj) * weight;
  if (/*user.commented*/ true) {
    weight = commentIncrease * weight;
  }
  return weight;
}

/* actual implementation depends on how it's stored
 */
/* STEPS
1. get website data 
2. check if user reviewed website already
3. calculate old website score and weight (weight in database, score = realiabilityScore * weight)
4. calculate new website score and weight
  a. if first review by user, score = score + userScore, weight = weight + userWeight
  b. otherwise, score = score + (userScore - oldUserScore), weight = weight + (newUserWeight - oldUserWeight)
5. ReliabilityScore = score / weight
6. post all updated values to database
*/

/*
ows: 3.2
odw: #of reviews 49
--
--
userWeight: 8.9
tto: 00:13:12
score: 4.2
*/


 function calculateScore(
  oldWebsiteScore,
  oldWebsiteWeight,
  oldUserScore,
  oldUserWeight,
  totalTimeOpened,
  newUserScore,
  documentObj
) {
  console.log(documentObj);
  var newUserWeight = weightCalculation(totalTimeOpened, documentObj);
  var newWebsiteScore = oldWebsiteScore * oldWebsiteWeight;
  newWebsiteScore =
    newWebsiteScore +
    (newUserScore * newUserWeight - oldUserScore * oldUserWeight);
  var newWebsiteWeight = oldWebsiteWeight + (newUserWeight - oldUserWeight);
  var newReliabilityScore = newWebsiteScore / newWebsiteWeight;
  return [newReliabilityScore, newWebsiteWeight, newUserScore, newUserWeight];
  /*
  //The goal of this request is to get the Website object the reviews into the variable reviews
  await axios.get('http://localhost:4000/api/websites/getSiteData', {params: {
    _id: url
  }}).then((response) => {
    oldWebsiteScore = response.reliabilityScore;
    console.log("got review data from " + url);
    console.log("Article score is "+ oldWebsiteScore);
  }).catch((error) => {
    console.log(error);
    console.log(error.response);
    console.log(error.response.data);
    console.log("oops");
    console.log("no dta for article yet");
  })
  if (failed) {
    return;
  }
  */
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
  //THE GOAL OF THIS POST IS TO UPDATE THE WEBSITE OBJECT IN THE DAtABASE
  /*axios.post('localhost:4000/getSiteData', payload2).then((response)=> {
    console.log("Successfully updated reviews");
  }).catch(error => {
    console.log("Could not update reviews")
  });
  */
  console.log(score / totalWeight);
  return 0;
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
 function timeAdjustment(totalTimeOpened, documentObj) {
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
  return expectedTime;
  console.log('Expected Reading Time : ' + expectedTime);
  if (expectedTime == 0) {
    return 1;
  }
  let actualTime = totalTimeOpened;
  console.log('Time read: ' + actualTime);
  return Math.min(1, (1 / (PERCENTOFEXPECTED * expectedTime)) * actualTime);
}

function timeWeight(timeOpened, expectedTime) {
  console.log(expectedTime);
  if (expectedTime == 0) {
    return 1;
  }
  let actualTime = timeOpened;
  console.log('Time read: ' + actualTime);
  return Math.min(1, (1 / (PERCENTOFEXPECTED * expectedTime)) * actualTime);
}

exports.timeAdjustment = timeAdjustment
exports.timeWeight = timeWeight
