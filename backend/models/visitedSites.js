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
    selections: {
      highlights: [
        {
          owner: String,
          selection: Object,
        },
      ],
      frowns: [
        {
          owner: String,
          selection: Object,
        },
      ],
      smiles: [
        {
          owner: String,
          selection: Object,
        },
      ],
    },
    commentContainers: [
      {
        range: String,
        comments: [{
          content: String,
          ownerName: String,
          ownerID: String,
          upvotes: Number,
          downvotes: Number,
          time: Date,
          replies: [
            {
              content: String,
              ownerName: String,
              ownerID: String,
              upvotes: Number,
              downvotes: Number,
              time: Date,
            },
          ],
        }],
      },
    ],
  },
  { collection: 'Websites' }
);

module.exports = mongoose.model('Websites', detail);
