// Query3: (20pts) Compute how many distinct users are there in the dataset.
// For this use a set by the screen_name, e.g. screen_names
const { createClient } = require("redis");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

async function disticntUsers() {
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

      await dbo
        .collection("tweet")
        .find(query)
        .forEach(async function (result) {
          if (result != null) {
            await client.sAdd("screen_names", result.user.screen_name);
          }
        });
      await db.close();
    } finally {
      // SCARD key
      // Returns the set cardinality (number of elements) of the set stored at key.
      const usersSum = await client.sCard("screen_names");
      console.log(
        "The total number of distinct users in the dataset is " + usersSum
      );
      await client.quit();
    }
  });
}

disticntUsers();
