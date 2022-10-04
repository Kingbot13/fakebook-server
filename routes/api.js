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
  passport.authenticate("facebook", { session: false }),
  apiController.logInPost
  // (req, res, next) => {
  //   return res
  //     .status(200)
  //     .cookie("jwt", signToken(req.user), { httpOnly: true })
  //     .redirect("/");
  // }
);

module.exports = router;
