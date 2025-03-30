import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import session from "express-session";
import { connectDB } from "./config/db.js";
import authRoutes from "./routers/user_router.js";
import express from "express";
import "./config/passport.js";
import passport from "passport";
import adminRouter from "./routers/admin_router.js";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //To pass form data from server

app.use(
    session({
        secret: process.env.SESSION_SECRET || "your_default_secret",
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 1000 * 60 * 60 },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs"); // Serve static files

app.set("views", path.join(__dirname, "./views"));
app.use(express.static(path.join(__dirname, "./public")))


app.use("/", authRoutes);
app.use("/", adminRouter);
app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});
