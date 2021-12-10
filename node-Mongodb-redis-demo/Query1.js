// Query1: (10pts) How many tweets are not retweets or replies?
// (hint the field retweeted_status contains an object when the tweet is a retweeet)
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("ieeevisTweets");
  var query = {
    $or: [{ retweeted_status: null }, { in_reply_to_status_id: null }],
  };
  dbo
    .collection("tweet")
    .find(query)
    .count(function (err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
});
