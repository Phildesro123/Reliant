require('dotenv').config({ path: __dirname + '/../.env' });
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const cors = require('cors');
const app = express();

// Define routers
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


app.listen(PORT, function () {
  console.log('Server is running on Port: ' + PORT);
});

module.exports = router;
