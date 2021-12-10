// Query1: (20pts) How many tweets are there? Create a tweetCount
// key that contains the total number of tweets in the database.
// For this, initialize tweetCount in 0 (SET), then query the tweets collection
// in Mongo and increase (INCR) tweetCount. Once the query is done,
// get the last value of tweetCount (GET) and print it in the console with a message that says
// "There were ### tweets", with ### being the actual number
const { createClient } = require("redis");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

async function calculateTweet() {
  await MongoClient.connect(url, async function (err, db) {
    if (err) throw err;
    var dbo = db.db("ieeevisTweets");
    var query = {};

    let client;
    try {
      client = createClient();
      client.on("error", (err) => console.log("Redis Client Error", err));
      await client.connect();
      console.log("connected");
      await client.set("tweetCount", "0");

      await dbo
        .collection("tweet")
        .find(query)
        .forEach(async function (result) {
          if (result != null) {
            await client.incrBy("tweetCount", 1);
          }
        });
      await db.close();
    } finally {
      const finalTweetCount = await client.get("tweetCount");
      console.log("There were " + finalTweetCount + " tweets");
      await client.quit();
    }
  });
}

calculateTweet();
