// Query4: (20pts) Create a leaderboard with the top 10 users with more tweets.
// Use a sorted set called leaderboard
const { createClient } = require("redis");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

async function createLeaderboard() {
  await MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    var dbo = db.db("ieeevisTweets");
    var aggregateOperation = [
      {
        $group: { _id: "$user.screen_name", num_of_tweets: { $sum: 1 } },
      },
      { $sort: { num_of_tweets: -1 } },
      { $limit: 10 },
    ];
    let client;
    try {
      client = createClient();
      client.on("error", (err) => console.log("Redis Client Error", err));
      await client.connect();
      console.log("connected");

      await dbo
        .collection("tweet")
        .aggregate(aggregateOperation)
        .forEach(async function (result) {
          if (result != null) {
            await client.zAdd("leaderboard:0:tweet", {
              score: result.num_of_tweets,
              value: result._id,
            });
          }
        });
      await db.close();
    } finally {
      var output = await client.zRangeWithScores(
        "leaderboard:0:tweet",
        "+inf",
        "-inf",
        {
          BY: "SCORE",
          REV: true,
        }
      );
      console.log(output);
      await client.quit();
    }
  });
}

createLeaderboard();
