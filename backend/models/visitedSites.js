const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let detail = new Schema(
  {
    _id: String,
    reliabilityScore: Number,
    numberOfReviews: Number,
    authors: [
      {
        firstName: String,
        lastName: String,
        rating: Number,
      },
    ],
    highlights: [
      {
        owner: String,
        selection: Object
      },
    ],
  },
  { collection: 'Websites' }
);

module.exports = mongoose.model('Websites', detail);
