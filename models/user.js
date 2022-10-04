const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  profileImage: Image,
  friends: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  facebookId: String,
});

UserSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", UserSchema);
