import { Howl } from 'howler';
import { CreateTransactionParams } from '../store/reducers';

//@ts-expect-error just a wav
import kaching from '../public/ka-ching.wav';

const dispense = new Howl({
  src: [kaching],
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function playCashSound(_params?: CreateTransactionParams): void {
  dispense.play();
}
