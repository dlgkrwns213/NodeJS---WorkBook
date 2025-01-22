import dotenv from "dotenv";
import express from "express";
import expressAsyncHandler from "express-async-handler";

dotenv.config();

const router = express.Router();

const isLogin = (req, res, next) => {
  if (req.cookies.userToken)
    res.redirect("/user");
  else if (req.cookies.adminToken)
    res.redirect("/admin");
  next();
}

router.get("/", isLogin, (req, res) => {
  res.render("mainPage", {layout: "../views/layouts/welcomePage.ejs"});
});

// login Page
// Get login
router.get(
  "/login",
  expressAsyncHandler ( async (req, res) => {
    res.render("../views/login/login", {layout: "../views/layouts/welcomePage.ejs"});
  })
);

export default router;