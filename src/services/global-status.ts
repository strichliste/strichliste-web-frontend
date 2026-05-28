import { useSyncExternalStore } from 'react';

/**
 * Polite live-region channel for transient success / status messages
 * (e.g. "transaction created", balance changes). Mirrors `global-error`
 * but used with `role="status"` so AT clients don't interrupt the user.
 *
 * The store carries a counter alongside the message so the same string
 * fired twice in a row still announces — without a unique snapshot,
 * useSyncExternalStore would skip the re-render.
 */

type Snapshot = { id: string; key: number };

let current: Snapshot = { id: '', key: 0 };
const listeners = new Set<() => void>();

export function setGlobalStatus(messageId: string): void {
  current = { id: messageId, key: current.key + 1 };
  listeners.forEach((l) => l());
}

export function clearGlobalStatus(): void {
  if (current.id === '') return;
  current = { id: '', key: current.key + 1 };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => current;

export function useGlobalStatus(): Snapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
