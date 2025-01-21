import express from "express";
import userRoutes from "./user/word.js";
import userLoginRoutes from "./login/userLogin.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("user/default", {layout: "../views/layouts/userPage.ejs"});
})

router.use("/", userLoginRoutes);
router.use("/word", userRoutes);

export default router;