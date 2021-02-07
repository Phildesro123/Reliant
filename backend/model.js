const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let detail = new Schema({

    firstName: {
        type: String
    }

}, {collection: 'Users'});


module.exports = mongoose.model("detail", detail);