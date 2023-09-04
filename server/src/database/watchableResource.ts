type Callback<ResourceShape> = (value: ResourceShape | null) => void
export class WatchableResource<ResourceShape> {
  private value: ResourceShape
  private callbacks: Array<Callback<ResourceShape>> = []
  constructor (resource: ResourceShape) {
    this.value = resource
  }

  update (newValue: ResourceShape): void {
    this.value = newValue
    const callbacksToRemove: unknown[] = []
    this.callbacks.forEach((cb) => {
      try {
        cb(this.value)
      } catch (e) {
        console.error(e)
        callbacksToRemove.push(cb)
      }
    })
    this.callbacks = this.callbacks.filter(
      (cb) => !callbacksToRemove.includes(cb),
    )
  }

  subscribe (callback: Callback<ResourceShape>): () => void {
    this.callbacks = [...this.callbacks, callback]
    callback(this.value)
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback)
    }
  }

  readOnce (): ResourceShape {
    return this.value
  }
}
