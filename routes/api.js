const { Router } = require("express");
const passport = require("passport");
const apiController = require("../controllers/apiController");

const router = Router();

router.get(
  "/auth/facebook/token",
  passport.authenticate("facebook-token", { session: false }),
  (req, res, next) => {
    if (!req.user) {
      return res.status(400);
    }
    return res.status(200).json({ user: req.user });
  }
);

// get posts
router.get(
  "/posts",
  passport.authenticate("facebook-token", { session: false }),
  apiController.postsGet
);

// handle post creation
router.post(
  "/posts",
  passport.authenticate("facebook-token", { session: false }),
  apiController.postPost
);

// handle post update
router.put(
  "/posts/:postId",
  passport.authenticate("facebook-token", { session: false }),
  apiController.postUpdate
);

// handle post reactions update
router.put(
  "/posts/:postId/reactions",
  passport.authenticate("facebook-token", { session: false }),
  apiController.postReactionsUpdate
);

// handle post deletion
router.delete(
  "/posts/:postId",
  passport.authenticate("facebook-token", { session: false }),
  apiController.postDelete
);

// get comments
router.get(
  "/comments",
  passport.authenticate("facebook-token", { session: false }),
  apiController.postsGet
);

// handle comment creation
router.post(
  "posts/:postId/comments",
  passport.authenticate("facebook-token", { session: false }),
  apiController.commentCreatePost
);

// handle comment update
router.put(
  "posts/:postId/comments/:commentId",
  passport.authenticate("facebook-token", { session: false }),
  apiController.commentUpdate
);

// handle comment deletion
router.delete(
  "posts/:postId/comments/:commentId",
  passport.authenticate("facebook-token", { session: false }),
  apiController.commentDelete
);

// handle comment reactions update
router.put(
  "posts/:postId/comments/:commentId/reactions",
  passport.authenticate("facebook-token", { session: false }),
  apiController.commentsReactionsUpdate
);

// get replies
router.get(
  "/replies",
  passport.authenticate("facebook-token", { session: false }),
  apiController.repliesGet
);

// create reply
router.post(
  "comments/:commentId/replies",
  passport.authenticate("facebook-token", { session: false }),
  apiController.replyCreatePost
);

// update reply
router.put(
  "comments/:commentId/replies/replyId",
  passport.authenticate("facebook-token", { session: false }),
  apiController.replyUpdate
);

// update reply reactions
router.put(
  "comments/:commentId/replies/replyId/reactions",
  passport.authenticate("facebook-token", { session: false }),
  apiController.replyUpdate
);

// delete reply
router.delete(
  "comments/:commentId/replies/replyId",
  passport.authenticate("facebook-token", { session: false }),
  apiController.replyDelete
);

module.exports = router;
