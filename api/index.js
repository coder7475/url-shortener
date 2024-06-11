require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const app = express();
// Basic Configuration
const port = process.env.PORT || 3000;

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
  app.post("/api/shorturl", function (req, res) {
    res.json({
      original_url: "https://www.google.com",
      short_url: 1,
    });
  });

  app.listen(port, function () {
    console.log(`Listening on port ${port}....`);
  });
}
