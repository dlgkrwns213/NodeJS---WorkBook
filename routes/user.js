import express from "express";
import userLoginRoutes from "./login/userLogin.js";
import userRoutes from "./user/word.js";
import userChapter from "./user/chapter.js";
import userBookmark from "./user/bookmark.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("user/default", {layout: "../views/layouts/userPage.ejs"});
})

router.use("/", userLoginRoutes);
router.use("/word", userRoutes);
router.use("/chapter", userChapter);
router.use("/bookmark", userBookmark);

export default router;