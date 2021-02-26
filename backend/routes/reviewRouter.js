const e = require('express');
let express = require('express');
let Review = require('../models/review');

const reviewRouter = express.Router({ mergeParams : true });
/**
 * Usage: User presses submit
 * Payload: {
 * _id":"{
 *  "userId":"{userID}",
 *  "url": "{website URL}"
 * },
 *  results: [{
 *      "question_ID": "{ObjectID of question}",
 *       "response": {numeric response to question}
 * }]
 * }
 * POST: Creates new review or update it if it exists.
 */
reviewRouter.route('/addReview').post((req, res, next) => {
    Review.exists({_id: {
        userId:req.body._id.userId,
        url: req.body._id.url
    }}, (err, result) => {
        if (err || result == null) {
            return res.status(400).send({message: "Error occured in checking if review exists"})
        }
        if (!result) {
            const userReview = new Review(req.body._id);
            return userReview.save();
        } else {
            Review.findById({ userId:req.body._id.userId,
                url: req.body._id.url}, (err, rs)=> {
                    if(err || rs == null) {
                        console.log("Error occured")
                        return res.status(400).send({message: "Error occured in checking if review exists"})
                    } else {
                        console.log("Results saved")
                        rs.results = req.body.results;
                        return rs.save();
                    }
                });
        }
    });
    console.log("Saved the review")
    res.status(200).send({response: "success"})
});

/** Usage: Questionnaire pulling results if user had any
 * Query Params:
 *      userId: {user's Id},
 *      url: {website's url}
 * GET: Get's user's response for website if they exist.
 */
reviewRouter.route('/getResults').get((req, res, next) => {
    console.log("Getting user's results from website")
    if (req.query.userId == null || req.query.url == null) {
        return res.status(400).send({message: "Send valid userId and/or url"})
    }
    Review.findById({userId: req.query.userId,
        url: req.query.url
    }, (err, result)=> {
        if (err) {
            console.log(err);
            return res.status(400).send(JSON.stringify(err));
        } else if (result) {
            console.log("Results found!");
            return res.status(200).send(result.results);
        } else {
            console.log("Found no results");
            return res.status(400).send({message: "No results found"})
        }
    });
 
  });

module.exports = reviewRouter;
