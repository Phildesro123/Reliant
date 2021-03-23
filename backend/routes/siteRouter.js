let express = require('express');
const VisitedSites = require('../models/visitedSites');
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
siteRouter.route('/addSite').post((req, res, next) => {
  console.log(
    "siteRouter: Creating new website if one doesn't already exist",
    req.body
  );
  VisitedSites.exists({ _id: req.body._id }, (err, doc) => {
    if (err || doc == null) {
      return res
        .status(400)
        .send({ message: 'Error occured in finding website' });
    }
    if (!doc) {
      console.log('Adding new site to Websites collection');
      const newSite = new VisitedSites(req.body);
      return newSite.save((error) => {
        if (error) {
          return res.send(error);
        } else {
          return res
            .status(200)
            .send({ message: 'Added website to Websites collection' });
        }
      });
    } else {
      console.log('Site is already in Websites collection');
      return res.send({ message: 'Website is already in Websites collection' });
    }
  });
});

/**
 * Usage: After calculating score again, we can change the reliabilityScore
 Payload: {
 * "_id":"{url [REQUIRED]}",
 * "reliablityScore":{score},
 * POST: Update website score
 */
siteRouter.route('/updateScore').post((req, res, next) => {
  console.log('POST: Updating website score for:', req.body);
  VisitedSites.findOne({ _id: req.body._id }, (err, results) => {
    if (err || results == null) {
      return res
        .status(400)
        .send({ message: 'Error in finding website in DB' });
    } else {
      console.log('Previous score:', results.reliabilityScore);
      results.reliabilityScore = req.body.reliabilityScore;
      console.log('Updated score:', results.reliabilityScore);
      results.save((error) => {
        if (error) {
          return res
            .status(400)
            .send({ message: 'Error occured in updating score' });
        } else {
          return res
            .status(200)
            .send({ message: "Updated website's reliabilityScore" });
        }
      });
    }
  });
});

/**
 * Usage: After calculating score again, we can change the number of reviews
 Payload: {
 * "_id":"{url [REQUIRED]}",
 * "numberOfReviews":number of reviews,
 * POST: Update number of reviews
 */
siteRouter.route('/updateReviews').post((req, res, next) => {
  console.log("POST: Updating website's number of reviews:", req.body);
  VisitedSites.findOne({ _id: req.body._id }, (err, results) => {
    if (err || results == null) {
      return res
        .status(400)
        .send({ message: 'Error in finding website in DB' });
    } else {
      console.log('Previous # of reviews:', results.numberOfReviews);
      results.numberOfReviews = req.body.numberOfReviews;
      console.log('Updated score:', results.numberOfReviews);
      results.save((error) => {
        if (error) {
          return res
            .status(400)
            .send({ message: 'Error occured in updating reviews' });
        } else {
          return res
            .status(200)
            .send({ message: "Updated website's number of reviews" });
        }
      });
    }
  });
});

/**
 * Usage: Probably when the user begins the access a new page.
 * ex:
 * send with a payload that at least has
 *
 * Query params
 *  "_id":"{currentURL from user}"
 * GET: Get stored information [from DB] on current site.
 */
siteRouter.route('/getSiteData').get((req, res, next) => {
  if (req.query._id == null) {
    console.log('ERROR: Null query received');
    return res.status(400).send({ message: 'Need a valid site URL' });
  }
  console.log('GET: Information about current site:', req.query._id);
  VisitedSites.findOne({ _id: req.query._id }, (err, result) => {
    if (err || result == null) {
      console.log(result);
      console.log('Error:', err);
      return res.status(400).send({ message: 'Current site not found' });
    } else {
      console.log('Result:', result);
      return res.send(result);
    }
  });
});


/**
 * Usage: Add's highlights to backend
 Payload: {
 * "_id":"{url [REQUIRED]}",
 * "userID": {User's ID}
 * "highlightselection":Highlight selection,
 * POST: Add highlight to website
 */
  siteRouter.route('/addHighlights').post((req, res, next) => {
    console.log("Request:", req)
    console.log("POST: Updating website's number of reviews:", req.body);
    console.log("Hightlight Selection:", JSON.stringify(req.body.highlightSelection))
    VisitedSites.findOne({ _id: req.body.url}, (err, results) => {
      if (err || results == null) {
        return res
          .status(400)
          .send({ message: 'Error in finding website in DB' });
      } else {
        results.highlights.push({"owner": req.body.userID,
      "selection": req.body.highlightSelection})
        results.save((error) => {
          if (error) {
            return res
              .status(400)
              .send({ message: 'Error occured in adding highlight' });
          } else {
            return res
              .status(200)
              .send({ message: "Updated website's stored highlights" });
          }
        });
      }
    });
  });

  /**
 * Usage: Probably when the user begins the access a new page.
 * ex:
 * send with a payload that at least has
 *
 * Query params
 *  "url":"{currentURL from user}",
 *  "userID": {userID}
 * GET: Get user's saved higlights on site
 */
siteRouter.route('/getUserHighlights').get((req, res, next) => {
  if (req.query.url == null) {
    console.log('ERROR: Null query received');
    return res.status(400).send({ message: 'Need a valid site URL' });
  }
  console.log('GET: Information about current site:', req.query.url);
  VisitedSites.findOne({ _id: req.query.url }, (err, result) => {
    if (err || result == null) {
      console.log(result);
      console.log('Error:', err);
      return res.status(400).send({ message: 'Current site not found' });
    } else {
      console.log('Result:', result);
      let highlights = result.highlights.filter(highlight => highlight.owner == req.query.userID);
      return res.send(highlights);
    }
  });
});
module.exports = siteRouter;
