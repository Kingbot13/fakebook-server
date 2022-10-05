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
  passport.authenticate("facebook", {
    session: false,
    successRedirect: "/",
    failureRedirect: "/api/auth/facebook",
  })
  // apiController.logInPost
  // (req, res, next) => {
  // return res.redirect('/');
  //     .status(200)
  //     .cookie("jwt", signToken(req.user), { httpOnly: true })
  //     .redirect("/");
  // }
);

router.post(
  "/auth/facebook/token",
  passport.authenticate("facebook-token", (req, res, next) => {
    if (!req.user) {
      return res.status(400);
    }
    return res.status(200).json({ user: req.user });
  })
);
router.get(
  "/auth/facebook/token",
  passport.authenticate("facebook-token"),
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

// handle comment creation
router.post(
  "posts/:postId/comments",
  passport.authenticate("facebook-token", { session: false }),
  apiController.commentCreatePost
);

module.exports = router;
