import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const accountId = process.env.R2_account_id ?? "";
const accessKeyId = process.env.R2_access_key_id ?? "";
const secretAccessKey = process.env.R2_secret_access_key ?? "";

export const remoteClient = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});
