const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reply = new Schema({
  text: { type: String, required: true }
}, { timestamps: { createdAt: "created_on" } });

const Reply = mongoose.model("Reply", reply);

module.exports = Reply;