import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  type ListBucketsCommandOutput,
  type ListObjectsV2CommandOutput,
  type GetObjectCommandOutput,
} from '@aws-sdk/client-s3'

const accountId = 'f3ce51ca8eb25deaf3375a5d74535a64'
const accessKeyId = 'a43841e46ea626187011747d8c79ce49'
const secretAccessKey = 'a6d1f9a5f4530655aea82b9c9b5831ab8fae18c0a1cf51594da603c71c23cba7'

export class RemoteStorage {
  private readonly remoteClient: S3Client

  constructor () {
    this.remoteClient = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  }

  async listBuckets (): Promise<ListBucketsCommandOutput> {
    return await this.remoteClient.send(
      new ListBucketsCommand(''),
    )
  }

  async listObjects (bucket: string): Promise<ListObjectsV2CommandOutput> {
    return await this.remoteClient.send(
      new ListObjectsV2Command({ Bucket: bucket }),
    )
  }

  async getObject (bucket: string, key: string): Promise<GetObjectCommandOutput> {
    return await this.remoteClient.send(
      new GetObjectCommand({ Bucket: bucket, Key: key }),
    )
  }

  async putObject (bucket: string, key: string, object: unknown): Promise<GetObjectCommandOutput> {
    return await this.remoteClient.send(
      new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: 'application/json', Body: JSON.stringify(object) }),
    )
  }
}
