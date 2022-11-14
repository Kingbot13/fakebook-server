const mongoose = require("mongoose");

const { Schema } = mongoose;

const CommentSchema = new Schema({
  date: Date,
  content: String,
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
  reactions: Array,
  isReply: Boolean,
});

module.exports = mongoose.model("Comment", CommentSchema);
