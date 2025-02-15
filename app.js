import dotenv from "dotenv";
import express from "express";
import mainRouter from "./routes/main.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import connectDB from "./config/db.js";
import expressEjsLayouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(expressEjsLayouts);
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(methodOverride("_method"));

app.use("/", mainRouter);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`Application listening on port ${port}`)
})