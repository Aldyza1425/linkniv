/**
 * db.js — IndexedDB Layer untuk LinkHub
 */
const DB_NAME = 'LinkHubDB';
const DB_VERSION = 1;
const STORE_NAME = 'links';

// Membuka atau membuat database IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // Membuat Object Store dengan 'id' sebagai keyPath
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        // Indeks untuk mempercepat pencarian dan pengurutan
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Mengambil semua data dari IndexedDB
async function getAllLinks() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

// Menambahkan data link baru
async function addLink(item) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(item);

    request.onsuccess = () => resolve(item);
    request.onerror = () => reject(request.error);
  });
}

// Menghapus link berdasarkan ID
async function deleteLink(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}
