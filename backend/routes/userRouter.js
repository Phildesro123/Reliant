let express = require('express');
let Users = require('../models/users');

const userRouter = express.Router();

/**
 * params: userID
 * GET: Get information on the current user
 */
userRouter.route('/:userID').get((req, res, next) => {
  const query = Users.find({ id: req.params.userID });
});
