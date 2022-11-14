const mongoose = require("mongoose");

const { Schema } = mongoose;

const ReplySchema = new Schema({
  date: Date,
  content: String,
  comment: { type: Schema.Types.ObjectId, ref: "Comment" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  reactions: Array,
  isReply: Boolean,
});

module.exports = mongoose.model("Reply", ReplySchema);
