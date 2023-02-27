import { Request, Response, NextFunction } from "express";

import { Server } from "socket.io";
export const initializeSocket = (app: any, io: Server<any>) => {
  app.use((req: Request, _: Response, next: NextFunction) => {
    if (!io) {
      return next();
    }
    req.io = io;
    return next();
  });
};
