import { type IStorageObject } from './remoteStorage.ts'

type Callback<ResourceShape> = (value: ResourceShape | null) => void
export type Computer<ResourceShape, ComputedValues> = { [K in keyof ComputedValues]: (resource: ResourceShape) => ComputedValues[K] }

export class WatchableResource<BaseResourceShape, ComputedValues> {
  private value!: BaseResourceShape & ComputedValues
  private callbacks: Array<Callback<BaseResourceShape & ComputedValues>> = []
  private readonly computer: Computer<BaseResourceShape, ComputedValues>
  private readonly storage: IStorageObject<BaseResourceShape> | null

  constructor (resource: BaseResourceShape, computer: Computer<BaseResourceShape, ComputedValues>, storage?: IStorageObject<BaseResourceShape>) {
    this.computer = computer
    this.setValue(resource)
    this.storage = storage ?? null
  }

  private setValue (nextValue: BaseResourceShape): void {
    this.value = Object.keys(this.computer).reduce<BaseResourceShape & ComputedValues>((combined, computeKey) => ({
      ...combined,
      [computeKey]: this.computer[computeKey as keyof ComputedValues](nextValue),
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    }), nextValue as BaseResourceShape & ComputedValues)

    if (this.storage) void this.storage.putFile(this.value)
  }

  update (_newValue: BaseResourceShape): void {
    this.setValue(_newValue)
    console.log(JSON.stringify(_newValue))
    const callbacksToRemove: unknown[] = []
    this.callbacks.forEach((cb) => {
      try {
        cb(this.readOnce())
      } catch (e) {
        console.error(e)
        callbacksToRemove.push(cb)
      }
    })
    this.callbacks = this.callbacks.filter(
      (cb) => !callbacksToRemove.includes(cb),
    )
  }

  subscribe (callback: Callback<BaseResourceShape & ComputedValues>): () => void {
    this.callbacks = [...this.callbacks, callback]
    callback(this.readOnce())
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback)
    }
  }

  readOnce (): BaseResourceShape & ComputedValues {
    return this.value
  }
}
