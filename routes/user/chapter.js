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

// Show Chapter total word
// Get /user/chapter/:chapterId
router.get(
  "/:chapterId",
  CheckUserLogin,
  expressAsyncHandler( async (req, res) => {
    try {
      const chapterId = req.params.chapterId
      const words = await Word.find({ chapter: chapterId });

      res.render("user/chapterTotalWord", {id: chapterId, data: words, layout: "../views/layouts/userPage.ejs"});
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  })
);

// Get /user/chapter/:chapterId/:wordId
router.get(
  "/:chapterId/:wordId",
  CheckUserLogin,
  expressAsyncHandler( async (req, res) => {
    try {
      const chapterId = req.params.chapterId;
      const wordId = req.params.wordId;

      const words = await Word.find({ chapter: chapterId });
      const wordIds = Object.values(words).map(w => w._id.toString());  // _id 값을 배열로 변환

      const word = await Word.findOne({ _id: wordId });
      const wordIndex = wordIds.indexOf(wordId);

      const befWordId = wordIndex > 0 ? wordIds[wordIndex-1] : null;
      const nxtWordId = wordIndex < Object.keys(words).length - 1 ? wordIds[wordIndex+1] : null;
      
      res.render("user/chapterWord", {wordIds: {befWordId, nxtWordId}, chapterId, data: word, layout: "../views/layouts/userPage.ejs"});
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  })
);

export default router;