let express = require('express');
let Users = require('../models/users');

const userRouter = express.Router();

/**
 * {
 *  "_id":"{some ID}",
 *  "website": "{website we add to user}""
 * }
 * POST: Add site to visited array. Or update it??
 */
userRouter.route('/updateSites').post((req, res, next)=>{
  console.log("Updating visitedSites")
  Users.findById(req.body._id, (err, results) => {
    if (err) {
      res.status(400).json(err);
    } else {
      if(!results.visitedSites.some(site => site._id === req.body.website))  {
        results.visitedSites.push(req.body.website)
        return results.save();
      } else {
        console.log("Site already exists in array, so just update timespent")
      }
    }

  });
  res.status(200).send({message: "Updated user's visitedSites"})
});


/**
 * Must receive an ID in order to get user info.
 * ex:
 * send with a payload that at least has 
 * {
 *  "_id":"{some ID}"
 * }
 * GET: Get information on the current user
 */
userRouter.route('/').get((req, res, next) => {
  console.log("We will get information about the current user");
  Users.findById(req.body._id, (err, user)=>{
    console.log(user);
  })
  res.status(200).json({message:"test"});
});


 module.exports = userRouter;