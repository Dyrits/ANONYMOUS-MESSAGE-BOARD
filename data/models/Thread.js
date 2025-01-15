const mongoose = require("mongoose");
const argon2 = require("argon2");
const Schema = mongoose.Schema;

const thread = new Schema({
  text: { type: String, required: true },
  password: { type: String, required: true },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }],
}, { timestamps: {  createdAt: "created_on", updatedAt: "bumped_on" } });

thread.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await argon2.hash(this.password);
  }
  next();
});


const Thread = mongoose.model("Thread", thread);

module.exports = Thread;