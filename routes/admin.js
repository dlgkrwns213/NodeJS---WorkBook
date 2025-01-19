import express from "express";
import wordRoutes from "./admin/word.js";
import userRoutes from "./admin/user.js";

const router = express.Router();

router.use('/word', wordRoutes);
router.use('/user', userRoutes);

export default router;