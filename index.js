const express = require("express");
const app = express();
require("dotenv").config();
var cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

let isStarted = false;

// if (!isStarted) {
//   const { retweet } = require("./controllers/twitter");
//   retweet()
//     .then(() => {
//       console.log("Retweeting...");
//     })
//     .catch((err) => {
//       console.log(err);
//       isStarted = false;
//     });
//   isStarted = true;
// }

const retweet = require("./routes/twitter");

//Routes
app.get("/", retweet);

app.get("/twitter", retweet);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
