let express = require('express');
let Users = require('../models/users');

const userRouter = express.Router();
/**
 * Usage: Probably when the extension is installed.
 * Payload: {
 * _id":"{some ID}",
 * "email":"{user's email}"
 * }
 * POST: Create new user if one doesn't already exist.
 */
userRouter.route('/').post((req, res, next) => {
  console.log("Creating new User if one doesn't already exist");
  Users.exists({ _id: req.body._id }, (err, doc) => {
    if (err || doc == null) {
      return res.status(400).send({message: "Error occured finding user in DB"});
    }
    if (!doc) {
      console.log('Creating new user!');
      const newUser = new Users(req.body);
      return newUser.save((error) => {
        if (error) {
          return res.status(400).send({message: "Error occured in saving user"});
        } else {
          return res.status(200).send({ message: 'created new user' });
        }
      });
    } else {
      console.log('User already existed');
      return res.send({ message: 'User already existed' });
    }
  });
});

/** Usage: Whenever the user accesses a new site or needs their site data updated
 * Payload: {
 *  "_id":"{user ID}",
 *  "website": "{_id: URL, timespent: Number}"
 * POST: Add site to user's visited array or update it.
 */
userRouter.route('/updateSites').post((req, res, next) => {
  console.log('Updating visitedSites for:', req.body._id);
  Users.findById(req.body._id, (err, results) => {
    if (err || results == null) { // Don't want any null results put into the DB
      return res.status(400).send({message:"Error occured in finding user or user doesn't exist"});
    } else {
      if (!results.visitedSites.some(sites => sites._id === req.body.website._id)) {
        results.visitedSites.push(req.body.website);
        return results.save();
      } else {
        console.log('Site already exists in array, so just update timespent');
      }
    }
  });
  res.status(200).send({ message: "Updated user's visitedSites" });
});

/**
 * Usage: Get information about current user
 * send with a payload that at least has
 * query params
 * {
 *  "_id":"{user ID}"
 * }
 * GET: Get information on the current user
 */
userRouter.route('/').get((req, res, next) => {
  if (req.query._id == null) {
    console.log("ERROR: Null userID")
    return res.status(400).send({message: "Null userID"});
  }
  console.log('GET: We will get information about the current user');
  Users.findById(req.query._id, (err, user) => {
    if (err || user == null) {
      console.log('error occured');
      return res.status(400).send({ message: 'User not found.' });
    }
    console.log(user);
    return res.status(200).send(user);
  });
});

/**
 * Usage: Get information about current user
 * send with a payload that at least has
 * query params
 * {
 *  "_id":"{user ID}",
 *  "url": 
 * }
 * GET: Get information on the current user
 */
 userRouter.route('/getNotes').get((req, res, next) => {
  if (req.query._id == null) {
    console.log("ERROR: Null userID")
    return res.status(400).send({message: "Null userID"});
  }
  console.log('GET: We will get information about the current user');
  Users.findById(req.query._id, (err, user) => {
    if (err || user == null) {
      console.log('error occured');
      return res.status(400).send({ message: 'User not found.' });
    }
    console.log(user);
    return res.status(200).send(user);
  });
});

/** Usage: Whenever the user adds a new comment.
 * Payload: {
 *  "_id":"{user ID}",
 *  "url": {url},
 *  "range": selectionRange,
 *  "content": Content of note
 * 
 * POST: Add note to user's notes array or update it.
 */
userRouter.route('/addNotes').post((req, res, next) => {
  if (req.body._id == null 
    || req.body.url == null 
    || req.body.range == null || req.body.content == null) {
    console.log("ERROR: Null userID")
    return res.status(400).send({message: "Null elements are found in payload"});
  }
  if (req.body.content.trim() === '') {
    console.log("ERROR: Cannot have empty contents")
    return res.status(400).send({message: "Empty Contents"});
  }
  Users.findById(req.body._id, (err, user) => {
    if (err || user == null) {
      console.log('error occured');
      return res.status(400).send({ message: 'User not found.' });
    } 
      let index = user.notes.findIndex((e)=> e.url === req.body.url && e.range === req.body.range)
      if (index >= 0) {
        user.notes[index].content = req.body.content;
        user.notes[index].time = Date.now();
      } else {
        user.notes.push({
          url: req.body.url,
          range: req.body.range,
          content: req.body.content,
          time: Date.now()
        });
      }
      user.save((err)=> {
        console.log(user);
        return res.status(200).send(user);
      });
    });
});



module.exports = userRouter;
