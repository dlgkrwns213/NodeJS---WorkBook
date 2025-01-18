import dotenv from "dotenv";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import Word from "../models/Word.js";

dotenv.config();

const router = express.Router();

router.get("/", (req, res) => {
  res.render("mainPage", {layout: "../views/layouts/welcomePage-nologin.ejs"});
})

router.get("/tmp", (req, res) => {
  res.render("words/saveWord", {layout: "../views/layouts/welcomePage.ejs"});
})


// Word Page
// Get /totalWordList
router.get("/totalWordsList", expressAsyncHandler( async (req, res) => {
  const totalWords = await Word.find();

  

  res.json(totalWords);
}));

export default router;