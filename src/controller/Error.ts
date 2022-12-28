import { ErrorRequestHandler } from "express";
import { CustomError } from "../util/Error";
export const errorLogger: ErrorRequestHandler = (
  error: CustomError,
  _,
  __,
  next
) => {
  console.error(error.status, error.stack, error.message);
  next(error);
};

export const errorHandler: ErrorRequestHandler = (
  error: CustomError,
  _,
  res,
  __
) => {
  res.status(error.status).send({
    message: error.message,
  });
};
