import { Howl } from 'howler';
import { CreateTransactionParams } from '../store/reducers';

const dispense = new Howl({
  src: ['ka-ching.wav'],
});

export function playCashSound(params: CreateTransactionParams): void {
    dispense.play();
}
