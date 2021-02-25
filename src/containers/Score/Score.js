const readingTime = require('reading-time');
const minTime = 10;
const commentIncrease = 1.25;
const defaultWeight = 1;
const percentOfExpected = 0.4;
//Used to see how long the user has been on the webpage
export function durationCheck(timeOpened) {
    let now = new Date().getTime()
    return (now - timeOpened)/1000;
}
//may need to send messages to index
function weightCalculation(userInfo) {
  /* Eliminate reviews from user who spent less than 10 seconds on the article.
  Requires input timeOpened (int), based on  */
  if (durationCheck(userInfo.timeOpened) <= minTime) {
    return 0;
  }
  let weight = defaultWeight;
  weight = timeAdjustment(userInfo) * weight;
  if (/*user.commented*/true) {
    weight = commentIncrease * weight;
  }
  return weight;
}

/* actual implementation depends on how it's stored
*/
export function calculateScore(reviews) {
  var score = 0;
  var totalWeight = 0;
  reviews.forEach(element => {
    score = score + (element[0]*element[1])
    totalWeight = totalWeight + element[1]
  });
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
export function timeAdjustment(userInfo, document) {
    let paragraphs = document.getElementsByTagName('p');
    var overall = '';
    for (const paragraph of paragraphs) {
        //Basic way to filter out title or unrelated content.
        if (paragraph.textContent.length > 100) {
            overall = overall + paragraph.textContent;
        }
      }
    let expectedTime = readingTime(overall).minutes*60;
    if (expectedTime == 0) {
        return 1;
    }
    return Math.min(1, (1/(percentOfExpected* expectedTime)) * durationCheck(userInfo.timeOpened));
}