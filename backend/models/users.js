const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let detail = new Schema(
  {
    _id: String,
    email: String,
    displayName: String,
    userRating: Number,
    visitedSites: [
      {
        url: String,
        timespent: { type: Number, default: 0 },
      },
    ],
  },
  { collection: 'Users' }
);

module.exports = mongoose.model('Users', detail);
