const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let detail = new Schema(
  {
    url: String,
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
        owner: mongoose.Types.ObjectId,
      },
    ],
  },
  { collection: 'Websites' }
);

module.exports = mongoose.model('Websites', detail);
