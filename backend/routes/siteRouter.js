let express = require('express');
const { container } = require('webpack');
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
 * "url":"{url [REQUIRED]}",
 * "userID": {User's ID},
 * "highlight_type": 'highlights, smiles, or frowns' [REQUIRED]
 * "highlightSelection":Highlight selection,
 * POST: Add highlight to website
 */
siteRouter.route('/addHighlights').post((req, res, next) => {
  console.log("POST: Updating website's number of reviews:", req.body);
  VisitedSites.findOne({ _id: req.body.url }, (err, results) => {
    if (err || results == null) {
      return res
        .status(400)
        .send({ message: 'Error in finding website in DB' });
    } else {
      if (req.body.highlight_type === 'highlights') {
        results.selections.highlights.push({
          owner: req.body.userID,
          selection: req.body.highlightSelection,
        });
      } else if (req.body.highlight_type === 'smiles') {
        results.selections.smiles.push({
          owner: req.body.userID,
          selection: req.body.highlightSelection,
        });
      } else if (req.body.highlight_type === 'frowns') {
        results.selections.frowns.push({
          owner: req.body.userID,
          selection: req.body.highlightSelection,
        });
      } else {
        //Error
        return res.status(400).send({
          message:
            'Invalid highlight_type string, use: "highlights", "frowns", or "smiles"',
        });
      }
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
  if (req.query.url == null || req.query.userID == null) {
    console.log('ERROR: Null query received');
    return res
      .status(400)
      .send({ message: 'Need a valid site URL and UserID' });
  }
  console.log('GET: Information about current site:', req.query.url);
  VisitedSites.findOne({ _id: req.query.url }, (err, result) => {
    if (err || result == null) {
      console.log(result);
      console.log('Error:', err);
      return res.status(400).send({ message: 'Current site not found' });
    } else {
      let highlights = result.selections.highlights.filter(
        (highlight) => highlight.owner == req.query.userID
      );
      let frowns = result.selections.frowns.filter(
        (highlight) => highlight.owner == req.query.userID
      );
      let smiles = result.selections.smiles.filter(
        (highlight) => highlight.owner == req.query.userID
      );
      return res.send({ highlights, frowns, smiles });
    }
  });
});

/**
 * Usage: When page loads, check if theres comments that needs to get loiaded
 * ex:
 * send with a payload that at least has
 *
 * Query params
 *  "url":"{currentURL from user}",
 * GET: Get user's saved comments from website.
 */
siteRouter.route('/getComments').get((req, res, next) => {
  if (req.query.url == null) {
    console.log('ERROR: Null query received');
    return res
      .status(400)
      .send({ message: 'Need a valid site URL and UserID' });
  }
  console.log('GET: Information about current site:', req.query.url);
  VisitedSites.findOne({ _id: req.query.url }, (err, result) => {
    if (err || result == null) {
      console.log(result);
      console.log('Error:', err);
      return res.status(400).send({ message: 'Current site not found' });
    } else {
      return res.send(result.commentContainers);
    }
  });
});

/**
 * Usage: When the user posts a new comment
 * ex:
 * send with a payload that at least has
 *
 * Payload: {
 *  "url":"{currentURL from user}",
 *  "userID": {userID},
 *  "userName": {userName},
 *  "range": rangeSelection
 *  "content": Content
 * }
 * POST: Add user's commment.
 */
siteRouter.route('/addComment').post((req, res, next) => {
  if (req.body.url == null) {
    console.log('ERROR: Null url received');
    return res.status(400).send({ message: 'Need a valid site URL' });
  }
  VisitedSites.findOne({ _id: req.body.url }, (err, result) => {
    if (err || result == null) {
      console.log(result);
      console.log('Error:', err);
      return res.status(400).send({ message: 'Current site not found' });
    }
    const containerIndex = result.commentContainers.findIndex(
      (container) => container.range == req.body.range
    );
    console.log('Found Container at index:', containerIndex);
    if (containerIndex == -1) {
      result.commentContainers.push({
        range: req.body.range,
        comments: [
          {
            content: req.body.content,
            ownerID: req.body.userID,
            ownerName: req.body.userName,
            upvotes: 0,
            downvotes: 0,
            time: Date.now(),
            replies: [],
          },
        ],
      });
    } else {
      result.commentContainers[containerIndex].comments.push({
        content: req.body.content,
        ownerID: req.body.userID,
        ownerName: req.body.userName,
        upvotes: 0,
        downvotes: 0,
        time: Date.now(),
        replies: [],
      });
    }

    result.save((err) => {
      if (err) {
        return res
          .status(400)
          .send({ message: 'Error occured in adding comment' });
      } else {
        return res.send({ message: 'Successfully added comment' });
      }
    });
  });
});

/**
 * Usage: When the user posts a reply
 * ex:
 * send with a payload that at least has
 *
 * Payload: {
 *  "url":"{currentURL from user}",
 *  "parentID": {id of parent},
 *  "parentContent": what are you replying to
 *  "userID": {userID},
 *  "userName": {userName},
 *  "range": rangeSelection of containr
 *  "content": Content
 * }
 * POST: Add user's commment.
 */
siteRouter.route('/addReply').post((req, res, next) => {
  if (req.body.url == null) {
    console.log('ERROR: Null url received');
    return res.status(400).send({ message: 'Need a valid site URL' });
  }
  VisitedSites.findOne({ _id: req.body.url }, (err, result) => {
    if (err || result == null) {
      console.log(result);
      console.log('Error:', err);
      return res.status(400).send({ message: 'Current site not found' });
    } else if (result.commentContainers.length != 0) {
      result.commentContainers.forEach((container) => {
        if (container.range == req.body.range) {
          container.comments
            .find(
              (el) =>
                el.content === req.body.parentContent &&
                el.ownerID === req.body.parentID
            )
            .replies.push({
              content: req.body.content,
              ownerID: req.body.userID,
              ownerName: req.body.userName,
              upvotes: 0,
              downvotes: 0,
              time: Date.now(),
            });
        }
      });
    }
    result.save((err) => {
      if (err) {
        return res
          .status(400)
          .send({ message: 'Error occured in adding comment' });
      } else {
        return res.send({ message: 'Successfully added comment' });
      }
    });
  });
});

/**
 * Usage: When the user deletes a comment
 * ex:
 * send with a payload that at least has
 *
 * Payload: {
 *  "url":"{currentURL from user}",
 *  "userID": {userID},
 *  "range": rangeSelection,
 *  "content": "Content of comment being deleted"
 * }
 * POST: Delete user's commment.
 */
siteRouter.route('/deleteComment').post((req, res, next) => {
  console.log('POST: Deleting comment');
  if (req.body.url == null) {
    console.log('ERROR: Null url received');
    return res.status(400).send({ message: 'Need a valid site URL' });
  }
  VisitedSites.findOne({ _id: req.body.url }, (err, result) => {
    if (err || result == null) {
      console.log(result);
      console.log('Error:', err);
      return res.status(400).send({ message: 'Current site not found' });
    } else if (result.commentContainers.length != 0) {
      result.commentContainers.forEach((container) => {
        if (container.range == req.body.range) {
          console.log('Container exists:', container);
          const index = container.comments.findIndex(
            (e) =>
              e.content === req.body.content && e.ownerID === req.body.userID
          );
          if (index >= 0) {
            console.log('Found comment at index:', index);
            container.comments.splice(index);
          }
        }
      });
    }
    result.save((err) => {
      if (err) {
        return res
          .status(400)
          .send({ message: 'Error occured in deleting comment' });
      } else {
        return res.send({ message: 'Successfully deleting comment' });
      }
    });
  });
});
module.exports = siteRouter;
