const ALGORITHM = { name: "AES-GCM", length: 256 } as const;
const IV_LENGTH = 12;
const STORAGE_PREFIX = "cc-e2ee-key:";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const getCrypto = () => {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.subtle) {
    return globalThis.crypto;
  }
  throw new Error("Web Crypto API is not available in this environment");
};

const toBase64 = (buffer: ArrayBuffer): string => {
  if (typeof btoa !== "undefined") {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  const nodeBuffer = (globalThis as { Buffer?: { from(data: ArrayBuffer): { toString(encoding: string): string } } }).Buffer;
  if (nodeBuffer) {
    return nodeBuffer.from(buffer).toString("base64");
  }

  throw new Error("No base64 encoder available");
};

const fromBase64 = (value: string): Uint8Array => {
  if (typeof atob !== "undefined") {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  const nodeBuffer = (globalThis as { Buffer?: { from(data: string, encoding: string): { values(): Iterable<number> } } }).Buffer;
  if (nodeBuffer) {
    const buffer = nodeBuffer.from(value, "base64");
    return new Uint8Array([...buffer.values()]);
  }

  throw new Error("No base64 decoder available");
};

const getStorage = () => {
  if (typeof localStorage === "undefined") {
    throw new Error("Local storage is not available");
  }
  return localStorage;
};

export const isWebCryptoAvailable = () => {
  try {
    getCrypto();
    return true;
  } catch {
    return false;
  }
};

export const ensureConversationKey = async (conversationId: string): Promise<CryptoKey> => {
  const crypto = getCrypto();
  const storage = getStorage();
  const storageKey = `${STORAGE_PREFIX}${conversationId}`;

  const storedKey = storage.getItem(storageKey);
  if (storedKey) {
    const rawKey = fromBase64(storedKey);
    return crypto.subtle.importKey("raw", rawKey.buffer as ArrayBuffer, ALGORITHM, true, ["encrypt", "decrypt"]);
  }

  const key = await crypto.subtle.generateKey(ALGORITHM, true, ["encrypt", "decrypt"]);
  const exported = await crypto.subtle.exportKey("raw", key);
  storage.setItem(storageKey, toBase64(exported));
  return key;
};

export const encryptString = async (text: string, key: CryptoKey): Promise<string> => {
  const crypto = getCrypto();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encodedText = encoder.encode(text);
  const encryptedBuffer = await crypto.subtle.encrypt({ name: ALGORITHM.name, iv }, key, encodedText);

  const payload = new Uint8Array(iv.byteLength + encryptedBuffer.byteLength);
  payload.set(iv, 0);
  payload.set(new Uint8Array(encryptedBuffer), iv.byteLength);

  return toBase64(payload.buffer);
};

export const decryptString = async (payload: string, key: CryptoKey): Promise<string> => {
  const crypto = getCrypto();
  const payloadBytes = fromBase64(payload);
  const iv = payloadBytes.slice(0, IV_LENGTH);
  const cipherBytes = payloadBytes.slice(IV_LENGTH);
  const decrypted = await crypto.subtle.decrypt({ name: ALGORITHM.name, iv }, key, cipherBytes);
  return decoder.decode(decrypted);
};

export const clearConversationKey = (conversationId: string) => {
  try {
    const storage = getStorage();
    storage.removeItem(`${STORAGE_PREFIX}${conversationId}`);
  } catch (error) {
    console.error("Unable to clear encryption key", error);
  }
};
