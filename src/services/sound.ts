import { Howl } from 'howler';
import { CreateTransactionParams } from '../types';

const dispense = new Howl({
  src: ['ka-ching.wav'],
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function playCashSound(_params?: CreateTransactionParams): void {
  dispense.play();
}
