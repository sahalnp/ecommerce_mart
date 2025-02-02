  import express from "express";
  import bcrypt from "bcrypt";
  import User from "../models/user.js";
  import { loginUser } from "../controllers/authController.js";

  const router = express.Router();

  router.get("/", (req, res) => {
    res.render("index");
  });

  router.get("/login", (req, res) => {
    res.render("login", { title: "Login-Edumart", user: null });
  });

  router.post("/login",loginUser)
  
  router.get("/signup", (req, res) => {
    res.render("signup", { title: "Signup", user: null });
  });

  router.post("/signup", async (req, res) => {
    
  });

  export default router;
