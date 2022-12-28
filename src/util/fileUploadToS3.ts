import multerS3 from "multer-s3";
import "dotenv/config";
import { S3 } from "../constants/S3Config";
import { v4 } from "uuid";
export const multerS3Config = () => {
  return multerS3({
    bucket: process.env.BUCKET_NAME,
    s3: S3 as any,
    acl: "public-read",
    metadata: function (_, file: any, cb) {
      console.log(file);

      cb(null, { fieldName: file.fieldname });
    },
    key: function (_, __, cd) {
      cd(null, v4());
    },
  });
};
