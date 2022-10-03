const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  profileImage: Image,
  friends: [{ type: Schema.Types.ObjectId, ref: "Users" }],
});

module.exports = mongoose.model("User", UserSchema);
