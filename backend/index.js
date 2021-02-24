require('dotenv').config({ path: __dirname + '/../.env' });
let Users = require('./models/users');
const express = require('express');
const router = express.Router();

const app = express();

const mongoose = require('mongoose');
const cors = require('cors');
const { isAssertionExpression } = require('typescript');
const { db } = require('./models/users');
const PORT = 4000;
app.use(cors());

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('MongoDB is connected');
  }
);
const user = new Users({
  _id: '105172363394352571826',
  email: 'test@gmail.com',
  displayName: 'Display Name',
});

user.save((error) => {
  if (error) {
    console.log('Could not save:', error);
  } else {
    console.log('User successfully saved!');
  }
});

Users.find({})
  .then((data) => {
    console.log('User Data:', data);
  })
  .catch((error) => {
    console.log('Error in Find:', error);
  });

app.use('/', router);

// gets things that are already in database
router.get('/', (req, res) => {
  detail.find({}, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.route('/').post(function (req, res) {
  const user = new Users({
    _id: '105172363394352571826',
    email: 'router@gmail.com',
    displayName: "It's from a route",
  });
  user.save((error) => {
    if (error) {
      console.log('Could not save:', error);
    } else {
      console.log('User successfully saved!');
    }
  });
});

app.listen(PORT, function () {
  console.log('Server is running on Port: ' + PORT);
});

module.exports = router;
