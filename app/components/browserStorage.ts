const sessionFallback = new Map<string, string>();

function getLocalStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getBrowserStorageItem(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  const storage = getLocalStorage();

  if (storage) {
    try {
      const value = storage.getItem(key);
      if (value !== null) {
        sessionFallback.set(key, value);
        return value;
      }
    } catch {}
  }

  return sessionFallback.get(key) ?? null;
}

export function setBrowserStorageItem(key: string, value: string) {
  if (typeof window === "undefined") {
    return false;
  }

  sessionFallback.set(key, value);

  const storage = getLocalStorage();
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeBrowserStorageItem(key: string) {
  if (typeof window === "undefined") {
    return false;
  }

  sessionFallback.delete(key);

  const storage = getLocalStorage();
  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
