import dotenv from "dotenv";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const router = express.Router();
const jwtUserSecret = process.env.JWT_USER_SECRET || 'USER_SECRET';

// register Page
// Get user/register
router.get(
  "/register",
  (req, res) => {
    res.render("../views/login/createUser", {layout: "../views/layouts/welcomePage.ejs"});
  }
);

// register Page
// Post user/register
router.post(
  "/register",
  expressAsyncHandler( async (req, res) => {
    const {userID, username, password} = req.body;
    
    if (await User.findOne({userID})) 
      return res.status(401).json({ Message: "이미 존재하는 사용자 계정입니다" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userID, name: username, password: hashedPassword,
    });

    res.redirect("/");
  })
);


// login Page
// Post user/login
router.post(
  "/login",
  expressAsyncHandler ( async (req, res) => {
    const {ID, password} = req.body;
    
    const user = await User.findOne({ ID });
    if (!user) 
      return res.status(401).json({ Message: "존재하지 않는 사용자 계정입니다" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ Message: "올바르지 않은 비밀번호입니다" });

    const token = jwt.sign({ id: user._id }, jwtUserSecret);
    res.cookie("userToken", token, {httpOnly: true});

    res.redirect("/user");
  })
);

// logout
// GET user/logout
router.get("/logout", (req, res) => {
  res.clearCookie("userToken");
  res.redirect("/");
})

export default router;