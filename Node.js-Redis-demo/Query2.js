// Query2: (20pts) Compute and print the total number of favorites
// in the dataset. For this apply the same process as before,
// query all the tweets, start a favoritesSum key (SET),
// increment it by the number of favorites on each tweet (INCRBY),
// and then get the value (GET) and print it on the screen.
const { createClient } = require("redis");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

async function calculatefavorites() {
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
        .forEach(
          async function (result) {
            if (result != null) {
              await client.incrBy("favoritesSum", result.favorite_count);
            }
          }
        );
      await db.close();
    } finally {
      const favoritesSum = await client.get("favoritesSum");
      console.log(
        "The total number of favorites in the dataset is " + favoritesSum
      );
      await client.quit();
    }
  });
}

calculatefavorites();
