import { remoteStorage } from "./RemoteStorage.ts";

export class StoreFile<T> {
  private readonly directory!: string;

  constructor(directory: string) {
    this.directory = directory;
  }

  getFile: (fileName: string) => Promise<T | null> = async (fileName: string) =>
    await remoteStorage.getFile(this.directory, fileName);

  putFile: (fileName: string, object: T) => Promise<void> = async (
    fileName: string,
    object: T,
  ) => {
    await remoteStorage.putFile(this.directory, fileName, object);
  };
}
