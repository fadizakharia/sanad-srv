import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";

import {
  logout,
  passportController,
  handleSignup,
  passportCallbackController,
} from "../controller/auth/auth";
import usersModel from "../model/user";
import { CustomError } from "../util/Error";

const router = Router();
router.post(
  "/local/login",
  passport.authenticate("local", { session: true }),
  async (req: Request, res: Response, next: NextFunction) => {
    const error = new CustomError("Something went wrong!", 500);
    try {
      if (!req.user) {
        res.status(405).send();
      }
      const foundUser = await usersModel.findById(req.user._id);
      if (!foundUser) {
        throw error;
      }

      res.status(200).send({ user: foundUser });
    } catch (err) {
      return next(err);
    }
  }
);
router.post("/local/signup", handleSignup);
router.get("/:strategy/callback", passportCallbackController);
router.get("/:strategy", passportController);
router.post("/", logout);

export { router as authRouter };
