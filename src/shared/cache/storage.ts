import { STORE_NAMES } from "./storeNames";

export interface RecordEntry<T = unknown> {
  key: string;
  value: T;
}

export interface StorageProvider {
  getRecord<T>(storeName: string, key: string): Promise<T | undefined>;
  setRecord<T>(storeName: string, key: string, value: T): Promise<void>;
  /** Частично обновить запись -- прочитать, смержить, записать. */
  patchRecord<T extends Record<string, unknown>>(
    storeName: string,
    key: string,
    partial: Partial<T>,
  ): Promise<void>;
  deleteRecord(storeName: string, key: string): Promise<void>;
  getAllRecords<T>(storeName: string): Promise<Array<RecordEntry<T>>>;
  clearStore(storeName: string): Promise<void>;
}

const DB_NAME = "web-ews-cache";

function semverToDbVersion(semver: string): number {
  const [major, minor, patch] = semver.split(".").map(Number);
  return major * 1_000_000 + minor * 1_000 + patch;
}

export class IndexedDbProvider implements StorageProvider {
  private db: IDBDatabase | null = null;
  private openPromise: Promise<IDBDatabase> | null = null;

  private async openDb(): Promise<IDBDatabase> {
    if (this.openPromise) return this.openPromise;

    const version = semverToDbVersion(APP_VERSION);

    this.openPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, version);

      req.onupgradeneeded = () => {
        const db = req.result;
        const stores = Object.values(STORE_NAMES);
        for (const storeName of stores) {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName);
          }
        }
      };

      req.onsuccess = () => {
        this.db = req.result;
        resolve(req.result);
      };
      req.onerror = () => reject(req.error);
      req.onblocked = () =>
        reject(new Error("IndexedDB blocked -- закрой другие вкладки"));
    });

    return this.openPromise;
  }

  private async withStore<T>(
    storeName: string,
    mode: IDBTransactionMode,
    fn: (store: IDBObjectStore) => IDBRequest<T>,
  ): Promise<T> {
    const db = await this.openDb();
    return new Promise<T>((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      const req = fn(store);

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => resolve(req.result);
      tx.onerror = () => reject(tx.error);
    });
  }

  async getRecord<T>(storeName: string, key: string): Promise<T | undefined> {
    if (key === undefined || key === null) return undefined;

    const result = await this.withStore<T | undefined>(
      storeName,
      "readonly",
      (store) => store.get(key),
    );
    return result ?? undefined;
  }

  async setRecord<T>(storeName: string, key: string, value: T): Promise<void> {
    if (key === undefined || key === null) return;

    await this.withStore(storeName, "readwrite", (store) =>
      store.put(value, key),
    );
  }

  async patchRecord<T extends Record<string, unknown>>(
    storeName: string,
    key: string,
    partial: Partial<T>,
  ): Promise<void> {
    if (key === undefined || key === null) return;

    const existing = await this.getRecord<Record<string, unknown>>(
      storeName,
      key,
    );
    const merged = existing
      ? { ...existing, ...partial }
      : (partial as Record<string, unknown>);
    await this.setRecord(storeName, key, merged);
  }

  async deleteRecord(storeName: string, key: string): Promise<void> {
    if (key === undefined || key === null) return;

    await this.withStore(storeName, "readwrite", (store) => store.delete(key));
  }

  async getAllRecords<T>(storeName: string): Promise<Array<RecordEntry<T>>> {
    const db = await this.openDb();
    return new Promise<Array<RecordEntry<T>>>((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const req = store.openCursor();
      const results: Array<RecordEntry<T>> = [];

      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          results.push({ key: String(cursor.key), value: cursor.value as T });
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      req.onerror = () => reject(req.error);
    });
  }

  async clearStore(storeName: string): Promise<void> {
    await this.withStore(storeName, "readwrite", (store) => store.clear());
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.openPromise = null;
    }
  }

  async deleteDb(): Promise<void> {
    this.close();
    return new Promise<void>((resolve, reject) => {
      const req = indexedDB.deleteDatabase(DB_NAME);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}

let _provider: IndexedDbProvider | null = null;

export function getStorageProvider(): IndexedDbProvider {
  if (!_provider) _provider = new IndexedDbProvider();
  return _provider;
}

export function setStorageProvider(provider: IndexedDbProvider): void {
  _provider = provider;
}

export function resetStorageProvider(): void {
  if (_provider) {
    _provider.close();
    _provider = null;
  }
}
