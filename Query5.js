// Query5: (30pts) Write the instructions that will separate the Users information into a different collection
// Create a user collection that contains all the unique users.
// Create a new Tweets_Only collection, that doesn't embed the user information, but instead references it using the user id
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("ieeevisTweets");
  var aggregateOperation1 = [
    {
      $group: {
        _id: "$user.name",
        user: {
          $last: "$user",
        },
      },
    },
    { $replaceRoot: { newRoot: "$user" } },
    { $out: "user_collection" },
  ];
  dbo
    .collection("tweet")
    .aggregate(aggregateOperation1)
    .toArray(function (err, result) {
      if (err) throw err;
      console.log("User collection created successfully!");
    });

  var aggregateOperation2 = [
      {$set: {user: "$user.id"}},
      {$out: "Tweets_Only"}  
    ];
  dbo
    .collection("tweet")
    .aggregate(aggregateOperation2)
    .toArray(function (err, result) {
      if (err) throw err;
      console.log("Tweets_Only collection created successfully!");
      db.close();
    });
});
