import { Howl } from 'howler';
import { CreateTransactionParams } from '../store/reducers';

const howls: Howl[] = [];
fetch('sound-config.json')
  .then(response => {
    if (response.status == 404) {
      throw Error('file "sound-config.json" not found');
    }
    return response.json()
  })
  .then(config => {
    const sounds = config['sounds'];
    for (let i=0; i<sounds.length; i++) {
      howls.push(new Howl({
        src: [sounds[i]]
      }));
    }
  })
  .catch(err => {
    console.error('Error while handling sound-config', err);
  });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function playCashSound(_params?: CreateTransactionParams): void {
  const sound = howls[Math.floor(Math.random() * howls.length)];
  sound.play();
}
