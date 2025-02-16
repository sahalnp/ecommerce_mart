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
          console.log("Email:", profile.emails[0].value);
          const email_val=profile.emails[0].value
          const google_user = await User.findOne({ email:email_val });
          req.session.google_user= profile.emails[0].value
          req.session.save();
          
          
          if (google_user) {
            return done(null, { profile, existingUser: true });
          } 
          else {
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

export default passport;
