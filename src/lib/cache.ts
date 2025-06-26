type CacheValue = {
  data: any;
  expiresAt: number;
};

const cache: { [key: string]: CacheValue } = {};

export function getCache(key: string) {
  const item = cache[key];
  if (!item || item.expiresAt < Date.now()) {
    delete cache[key];
    return null;
  }
  return item.data;
}

export function setCache(key: string, data: any, ttlMillis: number) {
  cache[key] = {
    data,
    expiresAt: Date.now() + ttlMillis,
  };
}
