import { Howl } from 'howler';
import { CreateTransactionParams } from '../store/reducers';

const deposit = new Howl({
  src: ['deposit.wav'],
});

const dispense = new Howl({
  src: ['dispense.wav'],
});

export function playCashSound(params: CreateTransactionParams): void {
  if (params.amount > 0) {
    deposit.play();
  } else {
    dispense.play();
  }
}
