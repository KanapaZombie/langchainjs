import { Generation } from "./llms/index.js";

// Takes in an arbitrary number of strings and returns a hash of them
// that can be used as a key in a cache.
export const getKey = async (...strings: string[]): Promise<string> => {
  let _webCrypto;
  if (typeof crypto === "undefined") {
    try {
      _webCrypto = (await import("crypto")).webcrypto;
    } catch (e) {
      throw new Error("Please provide a polyfill for the Web Crypto API");
    }
  } else {
    _webCrypto = crypto;
  }

  const hash = await _webCrypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(strings.join(""))
  );

  return hash.toString();
};

export abstract class BaseCache<T = Generation[]> {
  abstract lookup(key: string): T | undefined;

  abstract update(key: string, value: T): void;
}

export class InMemoryCache<T = Generation[]> extends BaseCache<T> {
  private cache: Record<string, T>;

  constructor() {
    super();
    this.cache = {};
  }

  lookup(key: string) {
    return this.cache[key];
  }

  update(key: string, value: T) {
    this.cache[key] = value;
  }
}
