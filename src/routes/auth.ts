import { Request, Response, Router } from "express";
import passport from "passport";

import {
  logout,
  passportController,
  handleSignup,
  passportCallbackController,
} from "../controller/auth/auth";

const router = Router();
router.post(
  "/local/login",
  passport.authenticate("local", { session: true }),
  (req: Request, res: Response) => {
    if (!req.user) {
      res.status(405).send();
    }
    res.status(200).send({ user: req.user });
  }
);
router.post("/local/signup", handleSignup);
router.get("/:strategy/callback", passportCallbackController);
router.get("/:strategy", passportController);
router.post("/", logout);

export { router as authRouter };
