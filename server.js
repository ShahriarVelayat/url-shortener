require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
var dns = require('dns');

var router = require("express").Router();

var mongoose = require("mongoose");
var connection = mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Url = require("./Models/url.model");
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;
const url_pattern = /((https|http):\/\/)(([^:\n\r]+):([^@\n\r]+)@)?((www\.)?([^/\n\r]+))\/?([^?\n\r]+)?\??([^#\n\r]*)?#?([^\n\r]*)/i;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/shorturl/:id", async function (req, res) {
  var exist = await find(req.params.id);
  if (exist) res.redirect(exist.original_url);
  else res.json({ response: "url not found" });
});

app.post("/api/shorturl/new", async function (req, res) {
  
  if ( !req.body.url || !req.body.url.match(url_pattern) ) {
    res.json({ error: "invalid url" });
    return;
  }
  var exist = await checkExists(req.body.url);
  if (exist) res.json({ shorturl: exist._id });
  else {
          console.log('req.body.url',req.body.url);


    dns.lookup('w3schools.com', function (err, addresses, family) {
      console.log('addresses',addresses);
      console.log('family',family);

      if(err){
        res.json({ error: "invalid url" });
      }
    var newUrl = new Url({ original_url: req.body.url });
    var data = newUrl.save((err, doc) => {
      if (err) {
        console.log(err);
        res.json({ error: err });
      }
      res.json({ original_url: doc.original_url,short_url:doc._id });
      return doc;
    });
});

  }
});

async function checkExists(original_url) {
  var data = await Url.findOne({ original_url: original_url }, (err, doc) => {
    if (err) console.log(err);
    return doc;
  });
  return data;
}

async function find(id) {
  var data = await Url.findById({ _id: id }, (err, doc) => {
    if (err) console.log(err);
    return doc;
  });
  return data;
}

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
