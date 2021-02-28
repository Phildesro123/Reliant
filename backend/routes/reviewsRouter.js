const e = require('express');
let express = require('express');
let Review = require('../models/review');
let Website = require('../models/visitedSites')

const reviewsRouter = express.Router({ mergeParams: true });
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
reviewsRouter.route('/addReview').post((req, res, next) => {
  console.log("Called addReview")
  Review.exists(
    {
      _id: {
        userId: req.body._id.userId,
        url: req.body._id.url,
      },
    },
    (err, result) => {
      if (err || result == null) {
        return res
          .status(400)
          .send({ message: 'Error occured in checking if review exists' });
      }
      if (!result) {
        const userReview = new Review(req.body);
        userReview.save().then(saveDoc => {
          res.status(200).send({ response: 'Added Results' });
          //update site reliability score
          updateReliabilityScore(req.body._id.url)
        });
      } else {
        Review.findById(
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
              return rs.save().then(savedDoc => {
                console.log('Saved the review');
                res.status(200).send({ response: 'Updated Results' });
                //update site reliability score
                updateReliabilityScore(req.body._id.url);
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

function updateReliabilityScore(url) {
  let avg = 0;
  Review.find({"_id.url": url}, "overallScore -_id", (err, res)=>{
   res.forEach(element => {
     avg += element.overallScore;
   })
   avg /= res.length;
   Website.findById(url, (err, rs)=>{
     if (rs) {
       rs.reliabilityScore = avg;
       rs.save();
     }
   })
  })
}

module.exports = reviewsRouter;
