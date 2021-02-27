let express = require('express');
const Questions = require('../models/questions');
const questionRouter = express.Router();
/**
 * Usage: Add questions.... (?)
 * Payload: {
 * "content": {content of question},
 * "genre": [{Genres in here}]
 * "weight": {weight of question},
 * POST: Add question to DB
 */
questionRouter.route('/addQuestion').post((req, res, next) => {
  console.log("POST: Creating new question if one doesn't already exist");
  Questions.exists({ content: req.body.content }, (err, doc) => {
    if (err || doc == null) {
      return res.status(400).send({ message: 'Error occured' });
    }
    if (!doc) {
      console.log('Adding new question to questions collection');
      const newQ = new Questions(req.body);
      return newQ.save((error) => {
        if (error) {
          return res.status(400).send({ message: 'ERROR OCCURED' });
        } else {
          return res
            .status(200)
            .send({ message: 'Added website to Websites collection' });
        }
      });
    } else {
      console.log('Question is already in collection');
      return res.send({ message: 'Question was already in collection' });
    }
  });
});

/**
 * Usage: Get questions for questionnaire
 * 
 * Query params
 *  "genre":"genre" (Optional, if no genre its gonna return all the questions??)
 * GET: Get question based on genre
 */
questionRouter.route('/getQuestions').get((req, res, next) => {
  console.log('GET: GET Questions');
  Questions.find({}, (err, result) => {
    if (err || result == null) {
      console.log('Error: Error occured');
      return res.status(400).send({ message: 'No questions found'});
    } else {
        let userMap = {};
        if (req.query.genre) {
            userMap = result.filter(quest => quest.genre.includes(req.query.genre))
        } else {
            userMap = result;
        }
      return res.send(userMap);
    }
  });
});

module.exports = questionRouter;
