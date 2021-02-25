let express = require('express');
const visitedSites = require('../models/visitedSites');
let VisitedSites = require('../models/visitedSites');
const siteRouter = express.Router();
/**
 * Usage: Probably done when the extension is loaded
 * Payload: {
 * "_id":"{url [REQUIRED]}",
 * "reliablityScore":{score},
 * "authors" : [
 *  {
 *      "firstName": "{author_Firstname}",
 *      "lastName": "{author_Lastname}",
 *      "rating": "{author rating}"
 *  }]
 * }
 * POST: Put website in DB with information
 */
siteRouter.route('/').post((req, res, next) => {
    console.log("siteRouter: Creating new website if one doesn't already exist", req.body);
    visitedSites.exists({_id: req.body._id}, (err, doc) => {
      if (err || doc == null) {
        return res.send(err);
      }
      if (!doc) {
        console.log('Adding new site to Websites collection');
        const newSite = new visitedSites(req.body);
        return newSite.save((error) => {
          if (error) {
            return res.send(error);
          } else {
            return res.status(200).send({ message: 'Added website to Websites collection' });
          }
        });
      } else {
        console.log('Site is already in Websites collection');
        return res.send({ message: 'Website is already in Websites collection' });
      }
    });
  });

/**
 Payload: {
 * "_id":"{url [REQUIRED]}",
 * "reliablityScore":{score},
 * POST: Update website information
 */
siteRouter.route('/updateScore').post((req, res, next) => {
  console.log('Updating website score for:', req.body);
  VisitedSites.findOne({_id: req.body._id}, (err, results) => {
    if (err || results == null) {
      return res.status(400).send({message: "Error in finding website in DB"});
    } else {
        console.log("Previous score:", results.reliabilityScore);
        results.reliabilityScore = req.body.reliabilityScore;
        console.log("Updated score:", results.reliabilityScore);
        results.save((error)=>{
            if(error) {
                return res.status(400).send({message: "Error occured in updating score"});
            } else {
                return res.status(200).send({ message: "Updated website's reliabilityScore" });
            }
        });
    }
  });
});

/**
 * Usage: Probably when the user begins the access a new page.
 * ex:
 * send with a payload that at least has
 * {
 *  "_id":"{currentURL from user}"
 * }
 * GET: Get stored information on current site.
 */
siteRouter.route('/').get((req, res) => {
  console.log('GET: Information about current site:', req.body);
  VisitedSites.findOne({ _id: req.body._id }, (err, result) => {
    if (err || result == null) {
      console.log(err);
      return res.status(400).send({ message: 'Current site not found' });
    } else {
      console.log(result);
      return res.send(JSON.stringify(result));
    }
  });
});

/**
 * Usage: Probably when the user begins the access a new page.
 * ex:
 * send with a payload that at least has
 * {
 *  "_id":"{currentURL from user}"
 * }
 * POST: Get stored information on current site.
 */
siteRouter.route('/getSiteData').post((req, res, next) => {
  console.log('POST: Information about current site:', req.body._id);
  VisitedSites.findOne({ _id: req.body._id }, (err, result) => {
    if (err || result == null) {
      console.log(result);
      console.log("Error:", err);
      return res.status(400).send({ message: 'Current site not found' });
    } else {
      console.log("Result:", result);
      return res.send(JSON.stringify(result));
    }
  });
});


module.exports = siteRouter;
