const { Schema, model } = require("mongoose");

const shortUrlSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  short_url: {
    type: String,
    required: true,
  },
});

export const ShortURL = model("ShortURL", shortUrlSchema);
