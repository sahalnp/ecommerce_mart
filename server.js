        import express from "express";
        import path from "path";
        import { fileURLToPath } from "url";
        import dotenv from "dotenv";
        import session from "express-session";
        import { connectDB } from "./config/db.js";
        import authRoutes from "./routers/router.js"; // Import the new router

        dotenv.config();
        connectDB();


        const app = express();
        const port=process.env.PORT

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        app.use(express.static(path.join(__dirname, "../public")));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        app.use(
        session({
            secret: process.env.SESSION_SECRET || "your_default_secret",
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false },
        })
        );

        app.set("view engine", "ejs");
        app.set("views", path.join(__dirname, "./views"));
        app.use(express.static(path.join(__dirname, "./public")));
        // Use the router for authentication routes
        app.use("/", authRoutes);

        app.listen(port, () => {
        console.log(`Server Started on http://localhost:${port}`);
        });
