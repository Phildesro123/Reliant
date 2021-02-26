const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let detail = new Schema(
  {
    _id: Object,
    results:[Object],
    weightedScore: Number
  },
  { collection: 'reviews' }
);

module.exports = mongoose.model('Review', detail);
