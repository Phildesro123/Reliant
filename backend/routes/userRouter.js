let express = require('express');
let Users = require('../models/users');

const userRouter = express.Router();

/**
 * 
 * GET: Get information on the current user
 */
userRouter.route('/').get((req, res, next) => {

  res.status(200).json({message:"test"});
});

/**
 * POST: Add site to visited array.
 */
userRouter.route('/updateSites').post((req, res, next)=>{
  console.log("Call coming here")
  const currentUser = Users.findById(req.body._id).exec((err, results) => {
      if (err) {
        res.send(err);
      } else {
        results.visitedSites.push(req.body.site)
        return results.save();
      }
  });

});

 module.exports = userRouter;