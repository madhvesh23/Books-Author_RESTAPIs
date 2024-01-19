const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  Publishment: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Books", default: [] },
  ],
});

const author = mongoose.model("Authors", authorSchema);

module.exports = author;
