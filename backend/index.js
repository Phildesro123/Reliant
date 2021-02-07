
let detail = require("./model");
const express = require("express");
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
const cors = require("cors");
const PORT = 4000;
app.use(cors());
//Connect to MongoDB database

const uri = "mongodb+srv://reliantDB:reliantPassword@cluster0.5a5qz.mongodb.net/reliant_database?retryWrites=true&w=majority";
mongoose.connect(uri,{useNewUrlParser:true},()=>{console.log("MongoDB is connected")});

app.use("/", router);

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


app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});