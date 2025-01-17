import dotenv from "dotenv";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import Word from "../models/Word.js";

dotenv.config();

const router = express.Router();

router.get("/", (req, res) => {
  res.render("welcomePage-nologin.ejs");
})

router.get("/tmp", (req, res) => {
  res.render("welcomePage.ejs");
})


// Word Page
// Get /totalWordList
router.get("/totalWordsList", expressAsyncHandler( async (req, res) => {
  const totalWords = await Word.find();

  

  res.json(totalWords);
}));

export default router;