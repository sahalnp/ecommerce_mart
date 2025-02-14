import express from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";

passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACKURL,
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          console.log("profile", profile);
  
          const google_user = await collection.findOne({ email: profile.email });
          if (google_user) {
            return done(null, { profile, existingUser: true });
          } else {
            return done(null, { profile, existingUser: false });
          }
        } catch (error) {
          console.log("The error is " + error);
          return done(error);
        }
      }
    )
  );
  
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),(req,res)=>{
    }
    
);
app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      if (req.user.existingUser) {
        res.render("home", { user: req.user.profile.displayName });
      } else {
        res.render("redirect-to-signup");
      }
    }
  );
  