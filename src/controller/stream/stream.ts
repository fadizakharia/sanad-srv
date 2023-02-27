import { Request, Response, NextFunction } from "express";
import { StreamChat } from "stream-chat";
import { CustomError } from "../../util/Error";
export const getInstance = (req: Request, _: Response, next: NextFunction) => {
  try {
    const api_key = process.env.GET_STREAM_API_KEY;
    const api_secret = process.env.GET_STREAM_API_SECRET;
    const streamClient = StreamChat.getInstance(api_key, api_secret);
    req.streamClient = streamClient;
    next();
  } catch (err) {
    const error = new CustomError("Something went wrong!" + err, 500);
    next(error);
  }
};
