require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const app = express();
// Basic Configuration
const port = process.env.PORT || 3000;

// MongoDB and mongoose connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// middlewares
app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: false }))
// routes
app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/public/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  console.log(req.body.url)
  res.json({
    original_url: "https://www.google.com",
    short_url: 1
  })
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
