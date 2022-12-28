import { NextFunction, Request, Response } from "express";

export const RequestLogger = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  console.log("params:", req.params);
  console.log("quries:", req.query);
  console.log("body:", req.body);
  return next();
};
