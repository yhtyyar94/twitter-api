const router = require("express").Router();

const { retweet } = require("../controllers/twitter");

router.get("/", async (req, res) => {
  retweet(req, res)
    .then(() => {
      console.log("Retweeting...");
    })
    .catch((err) => {
      console.log(err);
      isStarted = false;
    });
  res.send("Retweeting...");
});

module.exports = router;
