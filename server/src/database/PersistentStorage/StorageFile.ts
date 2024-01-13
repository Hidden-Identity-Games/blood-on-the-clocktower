import { type RemoteStorage } from "./RemoteStorage.ts";

export class StoreFile<T> {
  private readonly directory!: string;
  private readonly storage!: RemoteStorage;

  constructor(directory: string, storage: RemoteStorage) {
    this.directory = directory;
    this.storage = storage;
  }

  getFile: (fileName: string) => Promise<T | null> = async (fileName: string) =>
    await this.storage.getFile(this.directory, fileName);

  putFile: (fileName: string, object: T) => Promise<void> = async (
    fileName: string,
    object: T,
  ) => {
    await this.storage.putFile(this.directory, fileName, object);
  };
}
