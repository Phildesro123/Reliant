require('dotenv').config({ path: __dirname + '/../.env' });
const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();

// Define routers
const userRouter = require('./routes/userRouter');
const siteRouter = require('./routes/siteRouter');
const reviewsRouter = require('./routes/reviewsRouter');
const questionRouter = require('./routes/questionsRouter');

const mongoose = require('mongoose');
const { isAssertionExpression } = require('typescript');
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('MongoDB is connected');
  }
);
app.use(cors());
app.use('/', router);

if (process.env.NODE_ENV) {
  console.log('Environment:', process.env.NODE_ENV);
}

//Specify endpoints for router
app.use('/api/user', userRouter);
app.use('/api/websites', siteRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/question', questionRouter);

app.listen(PORT, function () {
  console.log('Server is running on Port: ' + PORT);
});

module.exports = router;
