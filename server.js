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
import MongoStore from "connect-mongo";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "./public")));
app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
      secret:process.env.MONGO_URL,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        dbName: "ecomerce", 
        collectionName: "sessions",
      }),
      cookie: {
        secure: false, 
        maxAge: 24 * 60 * 60 * 1000, 
      },
    })
  );
  

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs"); 

app.set("views", path.join(__dirname, "./views"));
app.use(express.static(path.join(__dirname, "./public")))

app.use("/", authRoutes);
app.use("/", adminRouter);
app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});