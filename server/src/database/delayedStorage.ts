export class DelayedStorage<T> {
  private dataStore: T | null;
  private readonly getRemote: () => T | null;
  private readonly setRemote: (value: T) => void;
  private readonly timeout: number;
  private timeoutId: NodeJS.Timeout | null;

  constructor(
    getRemote: () => T | null,
    setRemote: (value: T) => void,
    timeout: number,
    initialValue?: T,
  ) {
    this.timeoutId = null;
    this.timeout = timeout;
    this.getRemote = getRemote;
    this.setRemote = setRemote;

    if (initialValue) {
      this.dataStore = initialValue;
      this.set(this.dataStore);
    } else {
      this.dataStore = null;
    }
  }

  set(value: T): void {
    this.dataStore = {
      ...value,
    };
    this.saveLater();
  }

  setImmediately(value: T): void {
    this.set(value);
    this.saveNow();
  }

  get(): T | null {
    if (!this.dataStore) {
      this.dataStore = this.getRemote();
    }

    return this.dataStore ? { ...this.dataStore } : null;
  }

  private saveNow(): void {
    this.clearDelay();
    if (this.dataStore) {
      this.setRemote(this.dataStore);
    }
  }

  private saveLater(): void {
    if (!this.timeoutId) {
      this.timeoutId = setTimeout(() => {
        this.saveNow();
      }, this.timeout);
    }
  }

  private clearDelay(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
