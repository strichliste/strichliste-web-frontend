import { Howl } from 'howler';
import { CreateTransactionParams } from '../types';

const dispense = new Howl({
  src: ['ka-ching.wav'],
});

export function playCashSound(_params?: CreateTransactionParams): void {
  dispense.play();
}
