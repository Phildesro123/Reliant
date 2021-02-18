
let detail = require("./model");
const express = require("express");
const router = express.Router();
const app = express();

const mongoose = require('mongoose');
const cors = require("cors");
const { isAssertionExpression } = require("typescript");
const { db } = require("./model");
const PORT = 4000;
app.use(cors());
//Connect to MongoDB database

var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://reliantDB:reliantPassword@cluster0.5a5qz.mongodb.net/reliant_database?retryWrites=true&w=majority";
mongoose.connect(uri,{useNewUrlParser:true},()=>{console.log("MongoDB is connected")});

app.use("/", router);


// gets things that are already in database
router.get("/", (req, res)=> {
  detail.find({}, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});


router.route("/").post(function(req, res) {
  Users.insert(
    [
      {firstName: "Phil"}
    ], 
    function(err, result) {
      if(err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );

});


MongoClient.connect(uri, function(err, db) {
  if (err) throw err;
  var dbo = db.db("reliant_database");
  var myobj = { firstName: "Elon Musk"};
  dbo.collection("Users").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});

module.exports = router