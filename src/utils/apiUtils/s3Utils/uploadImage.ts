import { Upload } from "@aws-sdk/lib-storage";
import { AWS_FOLDER_NAME, AWS_S3_BUCKET_NAME } from "./constants";
import { s3 } from "./s3";
import { v4 as uuid } from "uuid";

export const uploadImage = async (base64: string): Promise<Upload> => {
  const base64Data = Buffer.from(
    base64.replace(/^data:\w+\/[a-zA-Z+\-.]+;base64,/, ""),
    "base64"
  );

  return new Upload({
    client: s3(),
    queueSize: 1,
    leavePartsOnError: true,
    partSize: 1024 * 1024 * 5,
    params: {
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
      Key: `${AWS_FOLDER_NAME}/${uuid()}.jpg`,
      Body: base64Data,
      Bucket: AWS_S3_BUCKET_NAME,
    },
  });
};
