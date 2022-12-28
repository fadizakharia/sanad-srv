import { config } from "dotenv";
import { StrategyOption } from "passport-facebook";

import { IOAuth2StrategyOption } from "passport-google-oauth";

config({
  path: process.env.NODE_ENV ? `env/${process.env.NODE_ENV}.env` : `env/.env`,
});
export const facebookConfig: StrategyOption = {
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/auth/facebook/callback`,
  profileFields: ["email", "first_name", "last_name"],
};

export const googleConfig: IOAuth2StrategyOption = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
};
