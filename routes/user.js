import dotenv from "dotenv";
import express from "express";
import User from "../models/User.js";
import userLoginRoutes from "./login/userLogin.js";
import userRoutes from "./user/word.js";
import userChapter from "./user/chapter.js";
import userBookmark from "./user/bookmark.js";
import jwt from "jsonwebtoken";

dotenv.config();

const router = express.Router();
const jwtUserSecret = process.env.JWT_USER_SECRET || "USER_SECRET";

// Check User Login
const checkUserLogin = async (req, res, next) => {
  const userToken = req.cookies.userToken;
  if (!userToken)
    res.redirect("/login");
  else {
    try {
      const decode = jwt.verify(userToken, jwtUserSecret);
      req.userID = decode.id;
      req.username = (await User.findOne({ _id: req.userID })).name;
      next();
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  }
};

router.get(
  "/", 
  checkUserLogin,
  (req, res) => {
    const locals = {
      name: req.username,
    }
    res.render("user/default", {locals, layout: "../views/layouts/userPage.ejs"});
})

router.use("/", userLoginRoutes);
router.use("/word", checkUserLogin, userRoutes);
router.use("/chapter", checkUserLogin, userChapter);
router.use("/bookmark", checkUserLogin, userBookmark);

export default router;