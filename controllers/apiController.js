const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const Reply = require("../models/reply");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const async = require("async");

exports.logInPost = (req, res, next) => {
  passport.authenticate("facebook", { session: false }, (err, user, info) => {
    return res.redirect("/");
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
      req.params.postId,
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
    // if user exists in reactions array, remove user. Otherwise add user to reactions array
    if (post.reactions.find((reaction) => reaction.user === req.body.user)) {
      const updateReactions = post.reactions.filter(
        (reaction) => reaction.user !== req.body.user
      );
      post.reactions = [...updateReactions];
    } else {
      post.reactions.push({ reaction: req.body.reaction, user: req.body.user });
    }
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

// handle post deletion
// TODO: delete all comments associated with post
exports.postDelete = (req, res, next) => {
  Post.findByIdAndRemove(req.params.postId, (err, post) => {
    if (err) {
      return res.status(400).json({ message: "error deleting post", post });
    }
    return res.status(200).json({ message: "success" });
  });
};

// handle comment update
exports.commentUpdate = [
  body("content", "content must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "error updating comment" });
    }
    Comment.findByIdAndUpdate(
      req.params.commentId,
      { content: req.body.content },
      (err, comment) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "error finding and updating comment", comment });
        }
        return res.status(200).json({ comment, message: "success" });
      }
    );
  },
];

// handle comment deletion
exports.commentDelete = (req, res, next) => {
  async.parallel(
    {
      post(cb) {
        Post.findById(req.params.postId).exec(cb);
      },
      comment(cb) {
        Comment.findById(req.params.commentId).exec(cb);
      },
    },
    (err, results) => {
      if (err) {
        return res.status(400).json({
          message: "error finding post and/or comment",
          post: results.post,
          comment: results.comment,
        });
      }
      const updatePostComments = results.post.comments.filter(
        (comment) => comment._id !== req.params.commentId
      );
      Post.findByIdAndUpdate(
        req.params.postId,
        { comments: updatePostComments },
        (err, post) => {
          if (err) {
            return res
              .status(400)
              .json({ message: "error finding or updating post", post });
          }
          Comment.findByIdAndRemove(req.params.commentId, (err) => {
            if (err) {
              return res
                .status(400)
                .json({ message: "error finding and removing comment" });
            }
            return res.status(200).json({ message: "success" });
          });
        }
      );
    }
  );
};

// handle comment reactions update
exports.commentsReactionsUpdate = (req, res, next) => {
  Comment.findById(req.params.commentId, (err, comment) => {
    if (err || !comment) {
      return res
        .status(400)
        .json({ message: "error finding comment", comment });
    }
    // if user exists in reactions array, remove user. Otherwise add user to reactions array
    if (
      comment.reactions.find((reaction) => reaction.user === req.body.userId)
    ) {
      const updateReactions = comment.reactions.filter(
        (reaction) => reaction.user !== req.body.userId
      );
      comment.reactions = updateReactions;
    } else {
      comment.reactions.push({ reaction: "like", user: req.body.userId });
    }
    comment.save((err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "error updating reactions", comment });
      }
      return res.status(200).json({ comment, message: "success" });
    });
  });
};

// create reply
exports.replyCreatePost = [
  body("content", "content must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const reply = new Reply({
      content: req.body.content,
      date: new Date(),
      user: req.body.userId,
      post: req.params.postId,
      isReply: req.body.isReply,
    });
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "error creating reply", reply });
    }
    reply.save((err, theReply) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "could not save comment", theReply });
      }
      Comment.findById(req.params.commentId, (err, comment) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "could not find comment", comment });
        }
        comment.comments.push(theReply._id);
        comment.save((err) => {
          if (err) {
            return res
              .status(400)
              .json({ message: "could not save changes to comment", comment });
          }
          return res
            .status(200)
            .json({ comment, theReply, message: "success" });
        });
      });
    });
  },
];

// update reply
exports.replyUpdate = [
  body("content", "content must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "error updating reply" });
    }
    Reply.findByIdAndUpdate(
      req.params.replyId,
      { content: req.body.content },
      (err, reply) => {
        if (err) {
          return res
            .status(400)
            .json({ message: "error finding and updating reply", reply });
        }
        return res.status(200).json({ reply, message: "success" });
      }
    );
  },
];
