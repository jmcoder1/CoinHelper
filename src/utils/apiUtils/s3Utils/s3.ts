import { S3Client, S3, S3ClientConfig } from "@aws-sdk/client-s3";
import { AWS_S3_REGION } from "./constants";

const config: S3ClientConfig = {
  region: AWS_S3_REGION as string,
  maxAttempts: 10,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
  },
};

export const s3 = () => new S3(config) || new S3Client(config);
