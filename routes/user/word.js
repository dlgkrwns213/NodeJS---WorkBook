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
}

router.get("/", CheckUserLogin, (req, res) => {
  const locals = {
    title: "단어장",
  }
  res.render("user/default", {locals, layout: "../views/layouts/userPage.ejs"});
});

router.get(
  "/show",
  CheckUserLogin, 
  expressAsyncHandler( async (req, res) => {
    try {
      const locals = {
        title: "전체 단어장",
      }
      const wordTotal = await Word.find();
      res.render("user/showTotalWord", {locals, data: wordTotal, layout: "../views/layouts/userPage.ejs"})
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  })
);

router.get(
  "/show/:ID",
  CheckUserLogin, 
  expressAsyncHandler( async (req, res) => {
    const wordID = req.params.ID;

    const totalWord = await Word.find();
    const totalWordIDs = Object.values(totalWord).map(w => w._id.toString());

    const word = await Word.findOne({_id: wordID});
    const wordIndex = totalWordIDs.indexOf(wordID);

    const befWordID = wordIndex > 0 ? totalWordIDs[wordIndex-1] : null;
    const nxtWordID = wordIndex < Object.keys(totalWordIDs).length - 1 ? totalWordIDs[wordIndex+1] : null;

    const userID = req.userID;
    const exsitingBookmark = await Bookmark.findOne({ userID, wordID });

    const saved = exsitingBookmark ? 1 : 0;

    const locals = {
      title: word.word,
    };
    res.render("user/showWord", {locals, wordIDs: {befWordID, nxtWordID}, bookmark: {saved, userID, wordID}, data: word, layout: "../views/layouts/userWordPage.ejs"});
  })
);

export default router;
