import { NextFunction, Request, Response } from "express";
import { TStatusType } from "../constants/status-types";
import { CustomError } from "./Error";

const isLoggedIn = (req: Request, _: Response, next: NextFunction) => {
  const error = new CustomError("Something went wrong!", 500);
  try {
    if (!req.user) {
      error.status = 405;
      error.message = "user is not logged in!";
      throw error;
    }
    return next();
  } catch (err) {
    return next(err);
  }
};
const allowedStatusChange = (
  currentStatus: TStatusType,
  userType: "driver" | "customer"
) => {
  switch (currentStatus) {
    case "available":
      if (userType === "customer") {
        return ["unfulfilled"];
      } else {
        return ["ongoing"];
      }

    case "fulfilled":
      if (userType === "customer") {
        return ["parked"];
      } else {
        return [];
      }

    case "ongoing":
      if (userType === "customer") {
        return [];
      } else {
        return ["unfulfilled"];
      }

    case "parked":
      if (userType === "customer") {
        return [];
      } else {
        return ["available"];
      }

    case "unfulfilled":
      if (userType === "customer") {
        return ["parked"];
      } else {
        return [];
      }
  }
};

export { isLoggedIn, allowedStatusChange };
