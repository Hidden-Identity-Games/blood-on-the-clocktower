import { type S3ServiceException } from "@aws-sdk/client-s3";

import { S3Storage } from "./S3Storage.ts";

class RemoteStorage {
  private readonly storage: S3Storage;

  constructor() {
    this.storage = new S3Storage();
  }

  getFile = async <T>(directory: string, file: string): Promise<T | null> => {
    try {
      const response = await this.storage.getObject(directory, file);

      if (response.$metadata.httpStatusCode === 200 && response.Body) {
        return JSON.parse(await response.Body.transformToString()) as T;
      }
    } catch (e) {
      const err = e as S3ServiceException;
      if (err.name !== "NoSuchKey") console.error(e);
    }

    return null;
  };

  putFile = async <T>(
    directory: string,
    file: string,
    object: T,
  ): Promise<void> => {
    try {
      const response = await this.storage.putObject(directory, file, object);
      if (response.$metadata.httpStatusCode !== 200) {
        console.error("Failed to save file to R2");
      }
    } catch (e) {
      console.error(e);
    }
  };
}

export const remoteStorage = new RemoteStorage();
