import dotenv from "dotenv";
import express from "express";
import Word from "../../models/Word.js";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

dotenv.config();

const router = express.Router();
const jwtUserSecret = process.env.JWT_USER_SECRET || "USER_SECRET";

// Check User Login
const CheckUserLogin = (req, res, next) => {
  const userToken = req.cookies.userToken;
  if (!userToken)
    res.redirect("/login");
  else {
    try {
      const decode = jwt.verify(userToken, jwtUserSecret);
      req.userId = decode.indexOf;
      next();
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  }
};

// Show Chapter
// Get /user/chapter
router.get(
  "/",
  CheckUserLogin,
  expressAsyncHandler( async (req, res) => {
    try {
      res.render("user/chapter", {layout: "../views/layouts/userPage.ejs"});
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  })
);

// Get /user/chapter/:id
router.get(
  "/:id",
  CheckUserLogin,
  expressAsyncHandler( async (req, res) => {
    try {
      const data = await Word.find({ chapter: id });
      res.render("user/chapterWord", {layout: "../views/layouts/userPage.ejs"});
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  })
)

export default router;