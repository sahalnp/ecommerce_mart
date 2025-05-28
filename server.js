import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import session from "express-session";
import express from "express";
import MongoStore from "connect-mongo";
import passport from "passport";
import csurf from "csurf";
import nocache from "nocache";

import { connectDB } from "./config/db.js";
import authRoutes from "./routers/user_router.js";
import adminRouter from "./routers/admin_router.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { limiter } from "./middleware/limiter.js";
import "./config/passport.js";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csrfProtection = csurf({ cookie: false });

// Static Files
app.use(express.static(path.join(__dirname, "./public")));
app.use("/uploads", express.static("uploads"));

// Middleware
app.use(nocache());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Session Setup
app.use(
  session({
    secret: process.env.MONGO_URL,
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

// Flash Messages
// Passport
app.use(passport.initialize());
app.use(passport.session());

// CSRF Protection
const skipCSRFPaths = [
  "/admin/product/edit",
  "/admin/upload"
];

// Conditionally apply CSRF
app.use((req, res, next) => {
  if (
    req.method === "POST" &&
    skipCSRFPaths.some(path => req.path.startsWith(path))
  ) {
    return next(); // Skip CSRF for selected routes
  }
  csrfProtection(req, res, next); // Apply CSRF for others
});

// Make CSRF token available in EJS
app.use((req, res, next) => {
  if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  }
  next();
});

// CSRF error handler
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).send("Form tampered with");
  }
  next(err);
});

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

// Routes
app.use("/", authRoutes);
app.use("/", adminRouter);

// Global Error Handler (last!)
app.use(errorHandler);

// Start Server
app.listen(port, () => {
  console.log(` Server Started on http://localhost:${port}`);
});
