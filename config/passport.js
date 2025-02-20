import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { User } from "../models/user.js";
passport.use(
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
        console.log("Profile:", profile);
        const email_val = profile.emails[0].value;
        let google_user = await User.findOne({ email: email_val });

        req.session.regenerate((err) => {  // Ensures session is properly initialized
          if (err) return done(err);
          
          req.session.user = email_val;
          req.session.save(() => {
            console.log("Session saved:", req.session.user);
            return done(null, { profile, existingUser: !!google_user });
          });
        });
      } catch (error) {
        console.log("Error:", error);
        return done(error);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.profile.id);  // Store only user ID
});

passport.deserializeUser(async (id, done) => {
  try {
      const user = await User.findOne({ googleId: id });
      done(null, user);
  } catch (error) {
      done(error, null);
  }
});
