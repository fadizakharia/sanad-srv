import { S3Client } from "@aws-sdk/client-s3";
import { config } from "dotenv";
config({
  path: `env/${process.env.NODE_ENV}.env`,
});
const CustomS3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});
export const S3 = CustomS3Client;
