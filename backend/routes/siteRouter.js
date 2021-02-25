let express = require('express');
const visitedSites = require('../models/visitedSites');
let VisitedSites = require('../models/visitedSites');

const siteRouter = express.Router();

/**
 * Usage: Probably done when the extension is loaded
 * Payload: {
 * "url":"{url [REQUIRED]}",
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
    console.log("Creating new website if one doesn't already exist");
    visitedSites.exists({url: req.body.url}, (err, doc) => {
      if (err || doc == null) {
        return res.send(err);
      }
      if (!doc) {
        console.log('Adding new site to DB');
        const newSite = new visitedSites(req.body);
        return newSite.save((error) => {
          if (error) {
            return res.send(error);
          } else {
            return res.status(200).send({ message: 'Added website to DB' });
          }
        });
      } else {
        console.log('Site is already in DB');
        return res.send({ message: 'Website is already in DB' });
      }
    });
  });

/**
 Payload: {
 * "url":"{url [REQUIRED]}",
 * "reliablityScore":{score},
 * POST: Update website information
 */
siteRouter.route('/updateScore').post((req, res, next) => {
  console.log('Updating website score');
  VisitedSites.findOne({url: req.body.url}, (err, results) => {
    if (err || results == null) {
      return res.status(400).send({message: "Error in finding website in DB"});
    } else {
        console.log(results.reliabilityScore);
        results.reliabilityScore = req.body.reliabilityScore;
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
 *  "url":"{currentURL from user}"
 * }
 * GET: Get stored information on current site.
 */
siteRouter.route('/').get((req, res, next) => {
  console.log('Information about current site');
  VisitedSites.findOne({ url: req.body.url }, (err, result) => {
    if (err || result == null) {
      console.log(err);
      return res.status(400).send({ message: 'Current site not found' });
    } else {
      console.log(result);
      return res.send(JSON.stringify(result));
    }
  });
});


module.exports = siteRouter;
