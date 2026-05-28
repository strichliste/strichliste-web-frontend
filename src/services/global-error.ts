import { useSyncExternalStore } from 'react';

/**
 * App-wide error banner state. Replaces the (otherwise empty) Redux error
 * slice: a tiny subscribable singleton so non-component code (like
 * `errorHandler`) can write to it and components subscribe via
 * `useSyncExternalStore`.
 */

let current = '';
const listeners = new Set<() => void>();

export function setGlobalError(message: string): void {
  if (current === message) return;
  current = message;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => current;

export function useGlobalError(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Non-hook accessor for tests and non-component callers. */
export function getGlobalError(): string {
  return current;
}
