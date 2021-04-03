const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let detail = new Schema(
  {
    _id: String,
    email: String,
    displayName: String,
    userRating: {type: Number, defualt: 80},
    visitedSites: [
      {
        _id: String,
        timespent: {type: Number, default: 0 },
      },
    ],
    notes: [
      {
        url: String,
        range: String,
        content: String,
        time: Date
      }
    ]
  },
  { collection: 'Users' }
);

module.exports = mongoose.model('Users', detail);
