import { beforeEach, vi } from "vitest";

const remoteStorage = {
  getFile: vi.fn().mockResolvedValue(null),
  putFile: vi.fn().mockResolvedValue(undefined),
};

beforeEach(() => {
  remoteStorage.getFile = vi.fn().mockResolvedValue(null);
  remoteStorage.putFile = vi.fn().mockResolvedValue(undefined);
});
vi.mock("../src/database/PersistentStorage/RemoteStorage.ts", () => {
  return {
    remoteStorage,
  };
});
