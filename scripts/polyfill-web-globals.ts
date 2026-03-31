/**
 * undici (used by Payload) expects global File on load. Node 18.x may not
 * expose it on globalThis; polyfill before any other imports in seed scripts.
 */
import { File } from "node:buffer";

if (typeof globalThis.File === "undefined") {
  Object.defineProperty(globalThis, "File", {
    value: File,
    writable: true,
    configurable: true,
  });
}
