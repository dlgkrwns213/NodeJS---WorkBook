import dotenv from "dotenv";
import express from "express";
import Word from "../../models/Word.js";
import Bookmark from "../../models/Bookmark.js";
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
      req.userID = decode.id;
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

// Show Chapter total word
// Get /user/chapter/:chapterID
router.get(
  "/:chapterID",
  CheckUserLogin,
  expressAsyncHandler( async (req, res) => {
    try {
      const chapterID = req.params.chapterID
      const words = await Word.find({ chapter: chapterID });

      res.render("user/chapterTotalWord", {chapterID, data: words, layout: "../views/layouts/userPage.ejs"});
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  })
);

// Get /user/chapter/:chapterID/:wordID
router.get(
  "/:chapterID/:wordID",
  CheckUserLogin,
  expressAsyncHandler( async (req, res) => {
    try {
      const chapterID = req.params.chapterID;
      const wordID = req.params.wordID;

      const words = await Word.find({ chapter: chapterID });
      const wordIDs = Object.values(words).map(w => w._id.toString());  // _id 값을 배열로 변환

      const word = await Word.findOne({ _id: wordID });
      const wordIndex = wordIDs.indexOf(wordID);

      const befWordID = wordIndex > 0 ? wordIDs[wordIndex-1] : null;
      const nxtWordID = wordIndex < Object.keys(words).length - 1 ? wordIDs[wordIndex+1] : null;
      
      const userID = req.userID;
      const exsitingBookmark = await Bookmark.findOne({ userID, wordID });

      const saved = exsitingBookmark ? 1 : 0;
      
      res.render("user/chapterWord", {wordIDs: {befWordID, nxtWordID}, bookmark: {saved, userID, wordID}, chapterID, data: word, layout: "../views/layouts/userWordPage.ejs"});
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  })
);

export default router;