// Query5: (30pts) Create a structure that lets you get all the tweets for an specific user.
// Use lists for each screen_name e.g. a list with key tweets:duto_guerra that points to a list of
// all the tweet ids for duto_guerra, e.g. [123, 143, 173, 213]. and then a hash that links
// from tweetid to the tweet information e.g. tweet:123 which points to all the tweet
// attributes (i.e. user_name, text, created_at, etc)
const { createClient } = require("redis");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

async function getTweets() {
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
      await client.set("favoritesSum", "0");

      await dbo
        .collection("tweet")
        .find(query)
        .forEach(async function (result) {
          if (result != null) {
            client.rPush(`tweets:${result.user.screen_name}`, `${result.id}`);
            client.hSet(`tweet:${result.id}`, {
              user_name: result.user.screen_name,
              created_time: result.created_at,
              text: result.text,
              tweet_source: result.source,
              favorite_count: result.favorite_count,
            });
          }
        });
      await db.close();
    } finally {
      // Example for getting the first tweet for an specific user:
      var result = await client.lRange("tweets:Mattie_Burkert", 0, 10);
      console.log(`${result}`);
      var firstTweet = await client.hGetAll(`tweet:${result[0]}`);
      console.log(firstTweet);
      await client.quit();
    }
  });
}

getTweets();
