import dotenv from "dotenv";
import express from "express";
import Admin from "../models/Admin.js";
import wordRoutes from "./admin/word.js";
import userRoutes from "./admin/user.js";
import adminLoginRoutes from "./login/adminLogin.js";
import jwt from "jsonwebtoken";

dotenv.config();

const router = express.Router();
const jwtAdminSecret = process.env.JWT_ADMIN_SECRET || 'ADMIN_SECRET';

// Check Admin Login
const checkAdminLogin = async (req, res, next) => {
  const adminToken = req.cookies.adminToken;
  if (!adminToken)
    res.redirect("/login");
  else {
    try {
      const decode = jwt.verify(adminToken, jwtAdminSecret);
      req.adminID = decode.id;
      req.adminName = (await Admin.findOne({ _id: req.adminID })).name;
      next();
    } catch (error) {
      res.redirect("/");
    }
  }
};

router.get(
  "/",
  checkAdminLogin, 
  (req, res) => {
    const locals = {
      name: req.adminName,
    }
    res.render("admin/default", {locals, layout: "../views/layouts/adminPage.ejs"});
})

router.use('/', adminLoginRoutes);
router.use('/word', checkAdminLogin, wordRoutes);
router.use('/user', checkAdminLogin, userRoutes);

export default router;