const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const async = require("async");

exports.logInPost = (req, res, next) => {
  passport.authenticate("facebook", { session: false }, (err, user, info) => {
    // if (err || !user) {
    //   return res.status(400).json({
    //     message: "error logging in user",
    //     user: user,
    //   });
    // }
    // req.login(user, { session: false }, (err) => {
    //   if (err) {
    //     res.send(err);
    //   }
    //   // generate a signed token with contents of user obj and return token
    //   const token = jwt.sign(user.toJSON(), process.env.SECRET_KEY);
    //   return res.status(200).json({ user, token });
    // });
    return res.redirect('/');
  })(req, res);
};

// get posts and comments
exports.postsGet = (req, res, next) => {
  Post.find()
    .populate("user")
    .populate("comments")
    .exec((err, posts) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "error retrieving posts", posts });
      }
      // successful
      return res.status(200).json({ posts });
    });
};

// handle post creation
exports.postPost = [
  body("content", "content must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const post = new Post({
      user: req.user.id,
      content: req.body.content,
      date: new Date(),
    });
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "error creating post", post });
    }
    // successful
    post.save((err) => {
      if (err) {
        return res.status(400).json({ message: "error saving post", post });
      }
      return res.status(200).json({ post, message: "success" });
    });
  },
];

// handle post content update
exports.postUpdate = [
  body("content", "content must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    Post.findByIdAndUpdate(
      req.params.id,
      {
        content: req.body.content,
      },
      (err, post) => {
        if (err || !post) {
          return res.status(400).json({
            message: "error updating or finding post to update",
            post,
          });
        }
        return res.status(200).json({ post, message: "success" });
      }
    );
  },
];

// handle post reactions update
exports.postReactionsUpdate = (req, res, next) => {
  Post.findById(req.params.postId, (err, post) => {
    if (err || !post) {
      return res.status(400).json({ message: "error finding post", post });
    }
    post.reactions.push({ reaction: "like", user: req.body.userId });
    post.save((err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "error updating reactions", post });
      }
      return res.status(200).json({ post, message: "success" });
    });
  });
};

// handle comment creation
exports.commentCreatePost = [
  body("content", "content must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const comment = new Comment({
      content: req.body.content,
      date: new Date(),
      user: req.body.userId,
      post: req.params.postId,
      isReply: req.body.isReply,
    });
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "error creating comment", comment });
    }
    comment.save((err, theComment) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "could not save comment", theComment });
      }
      Post.findById(req.params.postId, (err, post) => {
        if (err) {
          return res.status(400).json({ message: "could not find post", post });
        }
        post.comments.push(theComment._id);
        post.save((err) => {
          if (err) {
            return res
              .status(400)
              .json({ message: "could not save changes to post", post });
          }
          return res.status(200).json({ post, theComment, message: "success" });
        });
      });
    });
  },
];
