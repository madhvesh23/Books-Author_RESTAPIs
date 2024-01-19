const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
    min:0,
  },
  likeBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Authors",
      required: true,
      
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Authors",
    required: true,
  },
});

const book = mongoose.model("Books", bookSchema);

module.exports = book;
