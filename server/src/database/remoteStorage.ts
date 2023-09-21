import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  type ListBucketsCommandOutput,
  type ListObjectsV2CommandOutput,
  type GetObjectCommandOutput,
  type PutObjectCommandOutput,
} from '@aws-sdk/client-s3'

export class RemoteStorage {
  private readonly storage: S3Storage

  constructor () {
    this.storage = new S3Storage()
  }

  async listBuckets (): Promise<string[]> {
    const response = await this.storage.listBuckets()
    if (response.$metadata.httpStatusCode === 200 && response.Buckets) {
      return response.Buckets.map(({ Name }) => Name as string)
    }

    throw new Error('Remote storage error on listBuckets')
  }

  async listObjects (bucket: string): Promise<string[]> {
    const response = await this.storage.listObjects(bucket)
    if (response.$metadata.httpStatusCode === 200 && response.Contents) {
      return response.Contents.map(({ Key }) => Key as string)
    }

    throw new Error('Remote storage error on listObjects')
  }

  async getObject<T> (bucket: string, key: string): Promise<T> {
    const response = await this.storage.getObject(bucket, key)
    if (response.$metadata.httpStatusCode === 200 && response.Body) {
      return response.Body as T
    }

    throw new Error('Remote storage error on getObject')
  }

  async putObject<T> (bucket: string, key: string, object: T): Promise<void> {
    const response = await this.storage.putObject(bucket, key, object)
    if (response.$metadata.httpStatusCode !== 200) {
      throw new Error('Remote storage error on getObject')
    }
  }
}

// TODO: deploy keys
const accountId = ''
const accessKeyId = ''
const secretAccessKey = ''

class S3Storage {
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

  async putObject<T> (bucket: string, key: string, object: T): Promise<PutObjectCommandOutput> {
    return await this.remoteClient.send(
      new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: 'application/json', Body: JSON.stringify(object) }),
    )
  }
}
