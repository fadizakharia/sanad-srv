import { NextFunction, Request, Response } from "express";
import { Strategies, TStrategies } from "../../constants";
import passport from "passport";
import { CustomError } from "../../util/Error";
import { localSignupDTO } from "./auth.dto";
import user from "../../model/user";
export const passportController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth_strategy = req.params["strategy"] as TStrategies;
    const error = new CustomError("something went wrong!", 500);

    if (!Strategies.includes(auth_strategy)) {
      error.status = 400;
      error.message = "authentication method does not exist!";
      throw error;
    }
    console.log(auth_strategy);

    switch (auth_strategy) {
      case "facebook":
        passport.authenticate("facebook", {
          session: true,
          scope: ["email", "user_birthday"],
        })(req, res, next);
        break;
      case "google":
        console.log("im here");
        passport.authenticate("google", {
          session: true,
          scope: ["profile"],
        })(req, res, next);
        break;
      default:
        error.message = "action is not allowed!";
        error.status = 403;
        throw error;
    }
  } catch (err) {
    return next(err);
  }
};

export const passportCallbackController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new CustomError("something went wrong!", 500);
  const strategy = req.params["strategy"];
  try {
    if (Strategies.includes(strategy)) {
      passport.authenticate(
        strategy,
        {
          failureRedirect: `${process.env.BASE_URL}/auth/${strategy}`,
        },
        (req, res) => {
          res.redirect(
            `sanad://signup?first_name=${req.user.first_name}&last_name=${req.user.last_name}&email=${req.user.email}&phone_no=${req.user.phone_no}`
          );
        }
      )(req, res, next);
    } else {
      error.setValidationErrors({
        field: "strategy",
        message: "strategy does not exist!",
      });
      error.status = 400;
      throw error;
    }
  } catch (err) {
    return next(err);
  }
};
export const handleSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new CustomError("Something went wrong!", 500);

  const userInformation = req.body as localSignupDTO;
  try {
    const foundUser = await user.findOne();
    if (foundUser) {
      error.message = "user already exists!";
      error.status = 405;
      throw error;
    }
    const createdUser = await user.create({ ...userInformation });
    if (createdUser) {
      res.status(200).send({ user: userInformation });
    } else {
      throw error;
    }
  } catch (err) {
    return next(err);
  }
};
export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout(function (err) {
    if (err) {
      next(new CustomError(err.message, 500));
    }
    res.send({ status: true });
  });
};
