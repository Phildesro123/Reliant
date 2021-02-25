require('dotenv').config({ path: __dirname + '/../.env' });
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const cors = require('cors');
const app = express();
const userRouter = require('./routes/userRouter');
const siteRouter = require('./routes/siteRouter');

const mongoose = require('mongoose');
const { isAssertionExpression } = require('typescript');
const PORT = 4000;

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('MongoDB is connected');
  }
);
app.use(cors());
app.use(jsonParser);
app.use(urlencodedParser);
app.use('/', router);
app.use('/api/user', userRouter);
app.use('/api/websites', siteRouter);


// gets things that are already in database
/* router.get('/', (req, res) => {
  Users.find({})
  .then((data) => {
    res.send(data);
    console.log('User Data:', data);
  })
  .catch((error) => {
    res.send('Error in Find:', error);
    console.log('Error in Find:', error);
  });
}); */

/* router.route('/').post(function (req, res) {
  console.log("Request:", req.body)
  const user = new Users(req.body);
  user.save((error) => {
    if (error) {
      res.status(500).json({ msg: "Cound not save user: " + error})
      console.log("Could not save:", error)
    } else {
      res.json({ msg: "User data has been saved!"})
    }
  });
}); */

app.listen(PORT, function () {
  console.log('Server is running on Port: ' + PORT);
});

module.exports = router;
