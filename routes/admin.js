import express from "express";
import wordRoutes from "./admin/word.js";
import userRoutes from "./admin/user.js";
import adminLoginRoutes from "./login/adminLogin.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("admin/default", {layout: "../views/layouts/adminPage.ejs"});
})

router.use('/', adminLoginRoutes);
router.use('/word', wordRoutes);
router.use('/user', userRoutes);

export default router;