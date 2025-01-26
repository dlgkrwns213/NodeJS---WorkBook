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

// Show Total bookmark
// Get /user/bookmark/show
router.get(
  "/show",
  CheckUserLogin,
  expressAsyncHandler( async (req, res) => {
    try {
      const userID = req.userID;

      const bookmarkUserWordTotal = await Bookmark.find({ userID });
      const bookmarkUserWordIDs = Object.values(bookmarkUserWordTotal).map(w => w.wordID.toString());

      // bookmarkWordIDs 에 있는 것만 가져오기
      const bookmarkWordTotal = await Word.find({ _id: { $in: bookmarkUserWordIDs}});

      res.render("user/bookmarkTotalWord", {data: bookmarkWordTotal, layout: "../views/layouts/userPage.ejs"});
    } catch (error) {
      console.error(error);
      res.status(500).send("server error");
    }
  })
);

// Show bookmark
// Get /user/bookmark/show/:wordID
router.get(
  "/show/:wordID",
  CheckUserLogin,
  expressAsyncHandler( async (req, res) => {
    try {
      const userID = req.userID;
      const wordID = req.params.wordID;

      const bookmarkUserWordTotal = await Bookmark.find({ userID });
      const bookmarkUserWordIDs = Object.values(bookmarkUserWordTotal).map(w => w.wordID.toString());

      // bookmarkWordIDs 에 있는 것만 가져오기
      const bookmarkWordTotal = await Word.find({ _id: { $in: bookmarkUserWordIDs}});
      const bookmarkWordIDs = Object.values(bookmarkWordTotal).map(w => w._id.toString());

      const word = bookmarkWordTotal.find(w => w._id.toString().trim() === wordID);
      const wordIndex = bookmarkWordIDs.indexOf(wordID);

      const befWordID = wordIndex > 0 ? bookmarkWordIDs[wordIndex-1] : null;
      const nxtWordID = wordIndex < Object.keys(bookmarkWordIDs).length - 1 ? bookmarkWordIDs[wordIndex+1] : null;

      const exsitingBookmark = await Bookmark.findOne({ userID, wordID });
      const saved = exsitingBookmark ? 1 : 0;

      res.render("user/bookmarkWord", {wordIDs: {befWordID, nxtWordID}, bookmark: {saved, userID, wordID}, data: word, layout: "../views/layouts/userWordPage.ejs"});
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  })
);

// Add bookmark
// Post /user/bookmark/:wordID
router.post(
  '/:wordID',
  CheckUserLogin,
  expressAsyncHandler( async (req, res) => {
    const userID = req.userID;
    const wordID = req.params.wordID;
    
    try {
      const bookmarkWord = new Bookmark({
        userID, wordID
      });
      await bookmarkWord.save();
      res.status(201).send("저장됨");
          
    } catch (error) {
      console.error('error: ', error);
      res.status(500).send("server error");
    }
  })
);

// Delete bookmark
// Delete /user/bookmark//:wordID
router.delete(
  '/:wordID',
  CheckUserLogin,
  expressAsyncHandler( async (req, res) => {
    const userID = req.userID;
    const wordID = req.params.wordID;

    try {
      await Bookmark.deleteOne({ userID, wordID });

      res.status(201).send("삭제됨");
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  })
);

export default router;