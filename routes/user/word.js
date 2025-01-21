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
      console.log(decode)
      req.userID = decode.userID;
      console.log(req);
      next();
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  }
}

router.get("/", CheckUserLogin, (req, res) => {
  console.log('?')
  const locals = {

  }
  res.render("user/default", {locals, layout: "../views/layouts/userPage.ejs"});
});

router.get(
  "/show",
  CheckUserLogin, 
  expressAsyncHandler( async (req, res) => {
    try {
      const locals = {

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
  "/show/:id",
  CheckUserLogin, 
  expressAsyncHandler( async (req, res) => {
    const locals = {

    };
    const data = await Word.findOne({_id: req.params.id});
    res.render("user/showWord", {locals, data, layout: "../views/layouts/adminPage.ejs"});
  })
)

router.put(
  "/show/:id",
  CheckUserLogin, 
  expressAsyncHandler( async (req, res) => {
    try {
      await Word.findByIdAndUpdate(req.params.id, {
        word: req.body.word,
        pronunciation: req.body.pronunciation,
      });
      req.redirect("/user/word/show")
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    }
  })
);

export default router;
