import dotenv from "dotenv";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import Word from "../models/Word.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

router.get("/", (req, res) => {
  res.render("mainPage", {layout: "../views/layouts/welcomePage.ejs"});
})

// Word Page
// Get /totalWordList
router.get("/totalWordsList", expressAsyncHandler( async (req, res) => {
  const totalWords = await Word.find();

  

  res.json(totalWords);
}));

// register Page
// Get /register
router.get(
  "/register",
  (req, res) => {
    res.render("../views/user/createUser", {layout: "../views/layouts/welcomePage.ejs"});
  }
);

// register Page
// Post /register
router.post(
  "/register",
  expressAsyncHandler( async (req, res) => {
    const {userID, username, password} = req.body;
    
    if (await User.findOne({userID})) 
      return res.status(401).json({ Message: "이미 존재하는 계정입니다" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userID, name: username, password: hashedPassword,
    });

    res.redirect("/");
  })
);

// login Page
// Get /login
router.get(
  "/login",
  expressAsyncHandler ( async (req, res) => {
    res.render("../views/user/login", {layout: "../views/layouts/welcomePage.ejs"});
  })
);

// login Page
// Post /login
router.post(
  "/login",
  expressAsyncHandler ( async (req, res) => {
    const {userID, password} = req.body;
    
    const user = await User.findOne({ userID });
    if (!user) 
      return res.status(401).json({ Message: "존재하지 않는 계정입니다" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ Message: "올바르지 않은 비밀번호입니다" });

    const token = jwt.sign({ id: user._id }, jwtSecret);
    res.cookie("token", token, {httpOnly: true});

    res.redirect("/admin");
  })
);

// logout
// GET /logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/")
})

export default router;