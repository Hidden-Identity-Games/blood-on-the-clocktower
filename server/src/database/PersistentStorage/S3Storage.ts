import {
  GetObjectCommand,
  type GetObjectCommandOutput,
  PutObjectCommand,
  type PutObjectCommandOutput,
} from "@aws-sdk/client-s3";

import { remoteClient } from "./S3BaseClient.ts";

export class S3Storage {
  getObject = async (
    bucket: string,
    key: string,
  ): Promise<GetObjectCommandOutput> => {
    const response = await remoteClient.send(
      new GetObjectCommand({ Bucket: bucket, Key: key }),
    );
    return response;
  };

  putObject = async (
    bucket: string,
    key: string,
    object: unknown,
  ): Promise<PutObjectCommandOutput> => {
    const response = await remoteClient.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: "application/json",
        Body: JSON.stringify(object),
      }),
    );
    return response;
  };
}
