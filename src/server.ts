import dotenv from "dotenv";
// import { Request } from "express";
import app from "./app";
import { TStrategies } from "./constants";

dotenv.config({
  path: process.env.NODE_ENV ? `env/${process.env.NODE_ENV}.env` : `env/.env`,
});

declare global {
  namespace Express {
    interface Multer {}
    interface CustomUser {
      first_name: string;
      last_name: string;
      phone_no: number;
      password: string;
      email: string;
      physical_address: string;
      auth_strategies: Array<TStrategies>;
      bio: string;
      id: string;
    }
    interface User {
      first_name: string;
      last_name: string;
      phone_no: number;
      password: string;
      email: string;
      physical_address: string;
      auth_strategies: Array<TStrategies>;
      bio: string;
      id: string;
    }
    interface Request {
      currentUser: CustomUser;
    }
  }
}

app();
