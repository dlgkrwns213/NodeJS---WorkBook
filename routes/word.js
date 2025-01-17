import express from "express";
import Word from "../models/Word.js";
import expressAsyncHandler from "express-async-handler";

const router = express.Router();

router.post('/word/save', expressAsyncHandler( async (req, res) => {
  const wordData = req.body;

  console.log('Received word data:', wordData);
  
}));

export default router;