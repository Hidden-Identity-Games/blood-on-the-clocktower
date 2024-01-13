import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import { vi } from "vitest";

vi.mock("../src/database/PersistentStorage/S3BaseClient.ts", () => {
  const remoteClient = mockClient(S3Client);
  remoteClient.resolves({
    $metadata: { httpStatusCode: 200 },
  });
  remoteClient.on(GetObjectCommand).rejects({ name: "NoSuchKey" });
  return { remoteClient };
});
