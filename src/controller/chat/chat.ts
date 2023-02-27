import { Request, Response, NextFunction } from "express";
import user from "../../model/user";
import { CustomError } from "../../util/Error";
export const getTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new CustomError("Something went wrong!", 500);
  try {
    const streamInstance = req.streamClient;
    const foundUser = await user.findById(req.user._id);

    if (!foundUser.chat_token) {
      foundUser.chat_token = streamInstance.createToken(foundUser.id);
      await foundUser.save();
    }
    console.log(foundUser);

    res.send({ user: foundUser });
  } catch (err) {
    error.status = 500;
    error.message = "Something went wrong!" + err;
    return next(error);
  }
};
