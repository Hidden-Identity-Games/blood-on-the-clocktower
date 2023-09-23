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
  type S3ServiceException,
} from '@aws-sdk/client-s3'

export interface IStorageObject<T> {
  getFile: () => Promise<T | null>
  putFile: (object: T) => Promise<void>
}

export class StorageObject<T> implements IStorageObject<T> {
  private readonly directory!: string
  private readonly file!: string
  private readonly storage!: IStorage

  constructor (directory: string, file: string, storage: IStorage) {
    this.directory = directory
    this.file = file
    this.storage = storage
  }

  getFile: () => Promise<T | null> = async () => await this.storage.getFile(this.directory, this.file)
  putFile: (object: T) => Promise<void> = async (object: T) => { await this.storage.putFile(this.directory, this.file, object) }
}

interface IStorage {
  listDirectories: () => Promise<string[]>
  listFiles: (directory: string) => Promise<string[]>
  getFile: <T>(directory: string, file: string) => Promise<T | null>
  putFile: <T>(directory: string, file: string, object: T) => Promise<void>
}

export class RemoteStorage implements IStorage {
  private readonly storage: S3Storage

  constructor () {
    this.storage = new S3Storage()
  }

  listDirectories = async (): Promise<string[]> => {
    const response = await this.storage.listBuckets()
    if (response.$metadata.httpStatusCode === 200 && response.Buckets) {
      return response.Buckets.map(({ Name }) => Name as string)
    }

    throw new Error('Remote storage error on listBuckets')
  }

  listFiles = async (directory: string): Promise<string[]> => {
    const response = await this.storage.listObjects(directory)
    if (response.$metadata.httpStatusCode === 200 && response.Contents) {
      return response.Contents.map(({ Key }) => Key as string)
    }

    throw new Error('Remote storage error on listObjects')
  }

  getFile = async <T>(directory: string, file: string): Promise<T | null> => {
    try {
      const response = await this.storage.getObject(directory, file)
      if (response.$metadata.httpStatusCode === 200 && response.Body) {
        return JSON.parse(await response.Body.transformToString()) as T
      }
    } catch (e) {
      const err = e as S3ServiceException
      if (err.name === 'NoSuchKey') return null
      throw e
    }

    return null
  }

  putFile = async <T>(directory: string, file: string, object: T): Promise<void> => {
    const response = await this.storage.putObject(directory, file, object)
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

  listBuckets = async (): Promise<ListBucketsCommandOutput> => {
    const response = await this.remoteClient.send(
      new ListBucketsCommand(''),
    )
    return response
  }

  listObjects = async (bucket: string): Promise<ListObjectsV2CommandOutput> => {
    const response = await this.remoteClient.send(
      new ListObjectsV2Command({ Bucket: bucket }),
    )
    return response
  }

  getObject = async (bucket: string, key: string): Promise<GetObjectCommandOutput> => {
    const response = await this.remoteClient.send(
      new GetObjectCommand({ Bucket: bucket, Key: key }),
    )
    return response
  }

  putObject = async (bucket: string, key: string, object: unknown): Promise<PutObjectCommandOutput> => {
    const response = await this.remoteClient.send(
      new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: 'application/json', Body: JSON.stringify(object) }),
    )
    return response
  }
}
