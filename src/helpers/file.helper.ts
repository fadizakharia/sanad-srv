import { Request } from "express";

export const extractFilesFromKey = (req: Request, key: string) => {
  return (
    req.files as {
      [fieldname: string]: Express.Multer.File[];
    }
  )[key];
};
