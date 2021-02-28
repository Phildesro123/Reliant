const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let detail = new Schema(
  {
    _id: {
      userId: String,
      url: String,
    },
    results: [
      {
        _id: String,
        response: Number,
      },
    ],
    overallScore: Number,
  },
  { collection: 'reviews' }
);

module.exports = mongoose.model('Review', detail);
