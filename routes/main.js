import dotenv from "dotenv";
import express from "express";
import expressAsyncHandler from "express-async-handler";

dotenv.config();

const router = express.Router();

router.get("/", (req, res) => {
  res.render("mainPage", {layout: "../views/layouts/welcomePage.ejs"});
});

// login Page
// Get login
router.get(
  "/login",
  expressAsyncHandler ( async (req, res) => {
    res.render("../views/login/login", {layout: "../views/layouts/welcomePage.ejs"});
  })
);

export default router;