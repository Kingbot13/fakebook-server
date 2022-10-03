const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  date: Date,
  content: String,
  reactions: Array,
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

module.exports = mongoose.model("Post", PostSchema);
