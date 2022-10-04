const { Router } = require("express");
const passport = require("passport");

const router = Router();

router.get("/auth/facebook", passport.authenticate("facebook"));
router.get(
  "auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res, next) => {
    return res
      .status(200)
      .cookie("jwt", signToken(req.user), { httpOnly: true })
      .redirect("/");
  }
);

module.exports = router;
