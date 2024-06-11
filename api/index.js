require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");

// Basic Configuration
const app = express();
const port = process.env.PORT || 3000;
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
    const uuid = crypto.randomUUID().slice(0, 2);

    const data = {
      original_url: req.body.url,
      short_url: uuid,
    };

    const result = await ShortURL.create(data);
    // console.log(result);
    // const result = ShortURL.create(data);
    res.json(data);
  });

  app.listen(port, function () {
    console.log(`Listening on port ${port}....`);
  });
}
