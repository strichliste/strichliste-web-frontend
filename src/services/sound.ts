import { Howl } from 'howler';
import { CreateTransactionParams } from '../types';
import { isSoundEnabled } from './sound-preference';

const dispense = new Howl({
  src: ['ka-ching.wav'],
});

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

export function playCashSound(_params?: CreateTransactionParams): void {
  // Respect the explicit user preference *and* the OS-level reduced-motion
  // hint — vestibular users frequently also opt out of auditory feedback,
  // and a kiosk that fires on every keystroke-driven scan is exactly the
  // case WCAG 1.4.2 (Audio Control) cares about.
  if (!isSoundEnabled() || prefersReducedMotion()) return;
  dispense.play();
}
