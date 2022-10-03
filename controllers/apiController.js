const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

exports.logInPost = (req, res, next) => {
  passport.authenticate("facebook", (err, user));
};
