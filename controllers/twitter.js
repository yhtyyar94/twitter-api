const { TwitterApi, ETwitterStreamEvent } = require("twitter-api-v2");
require("dotenv").config();

const clientT = new TwitterApi(process.env.bearerToken);

const clientV = new TwitterApi({
  appKey: process.env.appKey,
  appSecret: process.env.appSecret,
  accessSecret: process.env.accessSecret,
  accessToken: process.env.accessToken,
});

const client = new TwitterApi({
  clientId: process.clientId,
  clientSecret: process.clientSecret,
});

const readOnlyClient = client.readWrite;

const retweet = async (req, res) => {
  // Get and delete old rules if needed
  const rules = await client.v2.streamRules();
  if (rules.data?.length) {
    await client.v2.updateStreamRules({
      delete: { ids: rules.data.map((rule) => rule.id) },
    });
  }

  // // Add our rules
  await client.v2.updateStreamRules({
    add: [
      { value: "stichtingsecu" },
      { value: "samenvvvEN" },
      { value: "samenvvvTR" },
      { value: "samenvvv" },
      { value: "pushback" },
    ],
  });

  const stream = await client.v2.getStream("tweets/search/stream", {
    "tweet.fields": ["entities", "text"],
    "media.fields": ["url"],
    "user.fields": ["username", "name", "profile_image_url"],
    expansions: ["author_id", "attachments.media_keys"],
  });

  // const stream = await client.v2.searchStream({
  //   "tweet.fields": ["entities", "text"],
  //   "media.fields": ["url"],
  //   "user.fields": ["username", "name", "profile_image_url"],
  //   autoConnect: true,
  //   expansions: ["author_id", "attachments.media_keys"],
  // });
  // Enable auto reconnect
  stream.autoReconnect = true;

  stream.on(ETwitterStreamEvent.Data, async (tweet) => {
    console.log({
      user: tweet.includes.users[0].username,
      tweet: tweet.data.text,
      tweetId: tweet.data.id,
      isRetweet: tweet.data.referenced_tweets?.some(
        (tweet) => tweet.type === "retweeted"
      ),
    });
    //if tweet.data.text does not start with RT then retweet
    if (
      tweet.data.text.startsWith("RT") ||
      tweet.data.referenced_tweets?.some((tweet) => tweet.type === "retweeted")
    ) {
      console.log("already retweeted");
    } else {
      console.log("retweeting");

      //   const retweet = await client.v2
      //     .retweet(tweet.data.id, {
      //       "tweet.fields": ["entities", "text"],
      //     })
      //     .then((res) => {
      //       console.log(res);
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
      //   console.log(retweet);
    }
    res.send("retweeting");
    //how can i obtain logged user id and then retweet the tweet with that id
  });
};

const getTweetsByUsername = async (req, res) => {
  const { username } = req.query;

  const tweets = await readOnlyClient.v2.userTimeline("1491004014992965635", {
    "tweet.fields": ["entities", "text"],
  });

  // i want to automatically retweet a certain user's tweets when they tweet and i want to do it with twitter-api-v2 library

  // const retweet = await client.v2.retweet("1491004014992965635", {
  //   "tweet.fields": ["entities", "text"],
  // });

  // console.log(retweet);

  res.json(tweets);
};

module.exports = { getTweetsByUsername, retweet };
