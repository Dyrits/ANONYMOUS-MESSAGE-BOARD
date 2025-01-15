const mongoose = require("mongoose");

const board = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
});

const Board = mongoose.model("Board", board);

module.exports = Board;