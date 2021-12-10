// Query2: (10pts) Return the top 10 screen_name by their number of followers.
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("ieeevisTweets");
  var query = {};
  dbo
    .collection("tweet")
    .find(query)
    .project({ _id: 0, "user.screen_name": 1 })
    .sort({ "user.followers_count": -1 })
    .limit(10)
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
});
