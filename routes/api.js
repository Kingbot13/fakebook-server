const { Router } = require("express");
const passport = require("passport");
const apiController = require("../controllers/apiController");

const router = Router();

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { session: false })
);
router.get(
  "auth/facebook/callback",
  // passport.authenticate("facebook", { session: false }),
  apiController.logInPost
  // (req, res, next) => {
  //   return res
  //     .status(200)
  //     .cookie("jwt", signToken(req.user), { httpOnly: true })
  //     .redirect("/");
  // }
);


// get posts
router.get('/posts', passport.authenticate('jwt', {session: false}), apiController.postsGet);

// handle post creation
router.post('/posts', passport.authenticate('jwt', {session: false}), apiController.postPost);

// handle post update
router.put('/posts/:postId', passport.authenticate('jwt', {session: false}), apiController.postUpdate);

// handle post reactions update
router.put('/posts/:postId/reactions', passport.authenticate('jwt', {session: false}), apiController.postReactionsUpdate);

// handle comment creation
router.post('posts/:postId/comments', passport.authenticate('jwt', {session: false}), apiController.commentCreatePost);

module.exports = router;
