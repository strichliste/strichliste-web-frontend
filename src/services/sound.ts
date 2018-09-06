import { Howl } from 'howler';

const sound = new Howl({
  src: ['cash.wav'],
});

export function playCashSound(): void {
  sound.play();
}
