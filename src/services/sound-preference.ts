import { useSyncExternalStore } from 'react';

/**
 * User-controlled sound preference, persisted to localStorage. Read by
 * `playCashSound` to decide whether to play; written by the footer mute
 * toggle. Default is "enabled" so behaviour matches the long-standing
 * default for installed kiosks; users on a quieter venue can flip it off
 * and it sticks.
 */

const STORAGE_KEY = 'strichliste_sound_enabled';

function readStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'false';
  } catch {
    // localStorage can be unavailable (e.g. privacy mode, SSR); default to on.
    return true;
  }
}

let enabled = readStored();
const listeners = new Set<() => void>();

export function setSoundEnabled(next: boolean): void {
  if (enabled === next) return;
  enabled = next;
  try {
    localStorage.setItem(STORAGE_KEY, String(next));
  } catch {
    /* ignore write failure — we still update in-memory state */
  }
  listeners.forEach((l) => l());
}

export function isSoundEnabled(): boolean {
  return enabled;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => enabled;

export function useSoundEnabled(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
