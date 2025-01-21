import dotenv from "dotenv";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import Admin from "../../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const router = express.Router();
const jwtAdminSecret = process.env.JWT_ADMIN_SECRET || 'ADMIN_SECRET';

// register Page
// Get /admin/register
router.get(
  "/register",
  (req, res) => {
    res.render("../views/login/createAdmin", {layout: "../views/layouts/welcomePage.ejs"});
  }
);

// register Page
// Post /admin/register
router.post(
  "/register",
  expressAsyncHandler( async (req, res) => {
    const {adminID, adminname, password} = req.body;
    
    if (await Admin.findOne({adminID})) 
      return res.status(401).json({ Message: "이미 존재하는 관리자 계정입니다" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      adminID, name: adminname, password: hashedPassword,
    });

    res.redirect("/");
  })
);


// login Page
// Post admin/login
router.post(
  "/login",
  expressAsyncHandler ( async (req, res) => {
    const {ID, password} = req.body;
    
    const admin = await Admin.findOne({ ID });
    if (!admin) 
      return res.status(401).json({ Message: "존재하지 않는 관리자 계정입니다" });

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword)
      return res.status(401).json({ Message: "올바르지 않은 비밀번호입니다" });

    const token = jwt.sign({ id: admin._id }, jwtAdminSecret);
    res.cookie("adminToken", token, {httpOnly: true});

    res.redirect("/admin");
  })
);

// logout
// GET admin/logout
router.get("/logout", (req, res) => {
  res.clearCookie("adminToken");
  res.redirect("/");
})

export default router;