export class DelayedStorage<T> {
  private dataStore: T | null
  private readonly getRemote: () => T | null
  private readonly saveNow: () => void
  private readonly saveLater: () => void
  private timeoutId: NodeJS.Timeout | null

  constructor (
    getRemote: () => T | null,
    saveRemote: (value: T) => void,
    timeout: number,
    initialValue?: T,
  ) {
    this.timeoutId = null
    this.getRemote = getRemote
    this.saveNow = () => {
      this.clearDelay()
      const get = this.get()
      if (get) {
        saveRemote(get)
      }
    }
    this.saveLater = () => {
      if (!this.timeoutId) {
        this.timeoutId = setTimeout(this.saveNow, timeout)
      }
    }
    if (initialValue) {
      this.dataStore = initialValue
      this.set(this.dataStore)
    } else {
      this.dataStore = null
    }
  }

  set (value: T): void {
    this.dataStore = {
      ...value,
    }
    this.saveLater()
  }

  setImmediately (value: T): void {
    this.set(value)
    this.saveNow()
  }

  get (): T | null {
    if (!this.dataStore) {
      this.dataStore = this.getRemote()
    }

    return this.dataStore ? { ...this.dataStore } : null
  }

  private clearDelay (): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }
}
