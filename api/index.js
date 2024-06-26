require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");
// Accessing dns module 
const validator = require("validator");
// Basic Configuration
const app = express();
const port = process.env.PORT || 3000;

const errosMsg = { error: "invalid url" }
const { Schema, model } = require("mongoose");

const shortUrlSchema = new Schema({
  original_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: String,
    required: true,
  },
});

const ShortURL = model("ShortURL", shortUrlSchema);

// middlewares
app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: false }));
// routes
app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/public/index.html");
});
// MongoDB and mongoose connect

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("connected to MongoDB...");

  // shortner api
  app.post("/api/shorturl", async function (req, res) {
    const validUrl = validator.isURL(req.body.url, {
      require_protocol: true
  });
  if (!validUrl) {
    res.json(errosMsg)
  }
    const uuid = crypto.randomUUID().slice(0, 2);

    const data = {
      original_url: req.body.url,
      short_url: uuid
    };
    const exits = await ShortURL.findOne({
      original_url: req.body.url,
    });
    if (!exits) {
      const result = await ShortURL.create(data);
    } else {
      data["short_url"] = exits.short_url;
    }
    // console.log(result);
    // const result = ShortURL.create(data);
    res.json(data);
  });

  // redirect
  app.get("/api/shorturl/:short_url", async (req, res) => {    
    const exits = await ShortURL.findOne({
      short_url: req.params.short_url,
    });
    if (exits) {
      res.redirect(301, exits.original_url);
    } else {
      res.json(errosMsg);
    }
  });

  app.listen(port, function () {
    console.log(`Listening on port ${port}....`);
  });
}
