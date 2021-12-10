// Query3: (10pts) Who is the person that got the most tweets?
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("ieeevisTweets");
  var aggregateOperation = [
    { $group: { _id: "$user.name", num_of_tweets: { $sum: 1 } } },
    { $sort: { num_of_tweets: -1 } },
    { $limit: 1 },
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
