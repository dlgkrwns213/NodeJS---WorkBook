import express from "express";
import User from "../../models/User.js";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

const router = express.Router();

// GET /admin/user
router.get(
  "/",
  (req, res) => {
  res.render("admin/default", {layout: "../views/layouts/adminPage.ejs"});
});

// Show Total user
// GET /admin/user/show
router.get(
  "/show",
  expressAsyncHandler( async (req, res) => {
    try {
      const userTotal = await User.find();
      res.render("admin/showTotalUser", {data: userTotal, layout: "../views/layouts/adminPage.ejs"});
    } catch (error) {
      console.error("Error saving word:", error.message);
    }
  })
);

// Edit user
// Get /admin/user/edit/:id
router.get(
  "/edit/:id",
  expressAsyncHandler( async (req, res) => {
    try {
      const userData = await User.findOne(({ _id: req.params.id }));
      
      res.render("admin/editUser", {data: userData, layout: "../views/layouts/adminPage.ejs"});
    } catch (error) {
      console.error("Error saving word:", error.message);
    }
  })
);

// Edit user
// Put /admin/user/edit/:id
router.put(
  "/edit/:id",
  expressAsyncHandler( async (req, res) => {
    try {
      const { userID, name, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = { userID, name, password: hashedPassword };
      
      await User.findByIdAndUpdate(req.params.id, updatedUser);
      res.redirect("/admin/user/show");
    } catch (error) {
      console.error("Error saving user:", error.message);
    }
  })
);

// Delete User
// Delete /admin/user/delete/:id
router.delete(
  "/delete/:id",
  expressAsyncHandler( async (req, res) => {
    try {
      await User.deleteOne({ _id: req.params.id });
      res.redirect("/admin/user/show");
    } catch (error) {
      console.log(error);
      res.status(500).send("server error");
    } 
  })
)

export default router;