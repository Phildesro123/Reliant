let express = require('express');
const Review = require('../models/review');
const Users = require('../models/users')
const Website = require('../models/visitedSites')
const reviewsRouter = express.Router({ mergeParams: true });
let Score = require('../Score/Score');
/**
 * Usage: User presses submit
 * Payload: {
 * _id":"{
 *  "userId":"{userID}",
 *  "url": "{website URL}"
 * },
 *  results: [{
 *      "_id": "{ObjectID of question}",
 *       "response": {numeric response to question}
 * }]
 * }
 * POST: Creates new review or update it if it exists.
 */
reviewsRouter.route('/addReview').post(async (req, res, next) => {
  console.log("Called addReview");
  await Review.exists(
    {
      _id: {
        userId: req.body._id.userId,
        url: req.body._id.url,
      },
    },
    async (err, result) => {
      if (err || result == null) {
        return res
          .status(400)
          .send({ message: 'Error occured in checking if review exists' });
      }
      console.log(req.body.timeNeeded);
      if (!result) {
        const userReview = new Review(req.body);
        userReview.save((error, savedDoc)=> {
          if (error) {
            return res.status(400).send({message: 'Error occured on saving review'})
          }
          //update site reliability score
          updateReliabilityScore(req.body._id.url, req.body.timeNeeded)
          return res.status(200).send({ response: 'Added Results' });
        })    
      } else {
        await Review.findById(
          { userId: req.body._id.userId, url: req.body._id.url },
          (err, rs) => {
            if (err || rs == null) {
              console.log('Error occured');
              return res.status(400).send({
                message: 'Error occured in checking if review exists',
              });
            } else {
              console.log('Results saved');
              rs.results = req.body.results;
              rs.overallScore = req.body.overallScore;
              return rs.save().then(async savedDoc => {
                console.log('Saved the review');
                res.status(200).send({ response: 'Updated Results' });
                //update site reliability score
                await updateReliabilityScore(req.body._id.url, req.body.timeNeeded);
              });
            }
          }
        );
      }
    }
  );
 
});

/** Usage: Questionnaire pulling results if user had any
 * Query Params:
 *      userId: {user's Id},
 *      url: {website's url}
 * GET: Get's user's response for website if they exist.
 */
reviewsRouter.route('/getResults').get((req, res, next) => {
  console.log("Getting user's results from website");
  if (req.query.userId == null || req.query.url == null) {
    return res.status(400).send({ message: 'Send valid userId and/or url' });
  }
  Review.findById(
    { userId: req.query.userId, url: req.query.url },
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).send(JSON.stringify(err));
      } else if (result) {
        console.log('Results found!');
        return res.status(200).send(result.results);
      } else {
        console.log('Found no results');
        return res.status(200).send({ message: 'No results found' });
      }
    }
  );
});

 async function updateReliabilityScore(url, timeNeeded) {
  var average = 0 ;
  let totalWeight = 0;
  await Review.find({"_id.url": url}, {"overallScore":1, "_id":1}, (err, res)=>{
    return res;
  }).then(res=> {
    var score = 0;
    var done = false;
    res.forEach(async (element, idx) => {
      await findWeight(url, element._id.userId, timeNeeded).then(we => {
        totalWeight += we;
        score += element.overallScore * we;
        average = score;
        average /= totalWeight;
        if (idx == res.length - 1) {
          done = true;
        }
        console.log('total weight of ', totalWeight, " with score of ", score);
      });
    });
  }).catch(err => {
    console.log(err);
    return 0;
  });
  
  Website.findById(url, (err, rs)=>{
    if (rs) {
      console.log("storing -->  ", average);
      rs.reliabilityScore = average;
      rs.save();
    }
  })
}

 async function findWeight(url, userId, timeNeeded) {
  var toReturn = 1;
  await Users.find({"_id":userId}, {"visitedSites":1}, (err, res) => {
    for (var i = 0; i < res[0].visitedSites.length; i++) {
      var current = res[0].visitedSites[i];
      if (current._id == url) {
        toReturn = Score.timeWeight(current.timespent, timeNeeded);
      }
    }
  });
  return toReturn;
}

module.exports = reviewsRouter;
