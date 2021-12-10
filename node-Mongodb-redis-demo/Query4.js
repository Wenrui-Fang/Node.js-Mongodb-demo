// Query4: (25) Who are the top 10 people that got more retweets in average, after tweeting more than 3 times
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("ieeevisTweets");
  var aggregateOperation = [
    {
      $group: {
        _id: "$user.name",
        total_tweet: {
          $sum: 1,
        },
        average_retweet: {
          $avg: "$retweet_count",
        },
      },
    },
    { $match: { total_tweet: { $gt: 3 } } },
    { $sort: { average_retweet: -1 } },
    { $limit: 10 },
  ];
  dbo
    .collection("tweet")
    .aggregate(aggregateOperation)
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
});
