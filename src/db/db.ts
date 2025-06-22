import { DB_NAME, DB_VERSION, STORES } from "./schema";

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            for (const [storeName, config] of Object.entries(STORES)) {
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, config);
                }
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getStore(storeName: string, mode: IDBTransactionMode = "readonly") {
    const db = await openDB();
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    return { store, tx };
}

export async function addItem<T>(storeName: string, item: T) {
    const { store, tx } = await getStore(storeName, "readwrite");

    return new Promise((resolve, reject) => {
        const request = store.add(item);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    })
}

export async function getItem<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    const { store } = await getStore(storeName);

    return new Promise((resolve, reject) => {
        const request = store.get(key);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    })
}

export async function getAllItems<T>(storeName: string): Promise<T[]> {
    const { store } = await getStore(storeName);
    
    return new Promise((resolve, reject) => {
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    })
}
