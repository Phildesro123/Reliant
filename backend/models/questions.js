const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let detail = new Schema(
  {
      questionText: String,
      genre:[String],
      questionWeight: Number
  },
  { collection: 'questions' }
);

module.exports = mongoose.model('Question', detail);
