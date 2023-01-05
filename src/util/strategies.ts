import passport from "passport";
import { argon2id, verify as verifyPassword } from "argon2";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import Session from "express-session";
import connect from "connect-redis";
import IORedis from "ioredis";
import user from "../model/user";
import { facebookConfig, googleConfig } from "../constants/auth-configs";

function initializePassport(app: any) {
  const redisClient = connect(Session as any);
  app.use(
    Session({
      store: new redisClient({
        client: new IORedis(),
      }),
      name: "msh",
      resave: false,
      cookie: {
        expires: new Date(253402300000000),
        secure: process.env.NODE_ENV === "production",
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const foundUser = await user.findOne({ email: username });
        const valid = await verifyPassword(foundUser.password, password, {
          type: argon2id,
        });
        if (!valid) {
          throw new Error("Username or password is incorrect");
        }
        return done(null, foundUser.toObject());
      } catch (err) {
        return done(null, false, { message: err.message });
      }
    })
  );
  passport.use(
    new FacebookStrategy(facebookConfig, async (_, __, profile, cb) => {
      try {
        const foundUser = await user.findOne({ username: profile.username });

        const oauthIndex = foundUser.auth_strategies.findIndex((el) => {
          if (el === "facebook") {
            return true;
          } else {
            return false;
          }
        });

        if (foundUser && oauthIndex) {
          cb(null, foundUser.toObject());
        } else if (foundUser) {
          foundUser.auth_strategies.push("facebook");
          await foundUser.save();
        } else {
          await user.create({
            email: profile.emails[0].value,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            auth_strategies: ["facebook"],
            is_registered: false,
          });
          cb(null, user);
        }
      } catch (err) {
        cb(null, null, { message: "something went wrong!" });
      }
    })
  );
  passport.use(
    new GoogleStrategy(googleConfig, async (_, __, profile, cb) => {
      try {
        const foundUser = await user
          .findOne({ username: profile.username })
          .populate("oauth");
        const oauthIndex = foundUser.auth_strategies.findIndex((el) => {
          if (el === "google") {
            return true;
          } else {
            return false;
          }
        });
        if (foundUser && oauthIndex) {
          cb(null, foundUser.toObject());
        } else if (foundUser) {
          foundUser.auth_strategies.push("google");
          await foundUser.save();
        } else {
          await user.create({
            email: profile.emails[0].value,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            auth_strategies: ["google"],
            is_registered: false,
          });
          cb(null, user);
        }
      } catch (err) {
        cb(null, null, { message: "something went wrong!" });
      }
    })
  );
  passport.serializeUser(function (user: any, cb) {
    process.nextTick(function () {
      cb(null, user);
    });
  });

  passport.deserializeUser(function (user: any, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });
  return passport;
}
export default initializePassport;
